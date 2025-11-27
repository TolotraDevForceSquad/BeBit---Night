-- ======================
-- Création de la base de données et extensions
-- ======================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ======================
-- Users table
-- ======================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'artist', 'club', 'admin')),
    profile_image TEXT,
    city TEXT DEFAULT '',
    country TEXT DEFAULT '',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    wallet_balance NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ======================
-- Artists table
-- ======================
CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    genre TEXT NOT NULL,
    bio TEXT,
    rate NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tags JSONB NOT NULL DEFAULT '[]',
    popularity INTEGER NOT NULL DEFAULT 0
);

-- ======================
-- Clubs table
-- ======================
CREATE TABLE clubs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    capacity INTEGER NOT NULL,
    description TEXT,
    profile_image TEXT,
    rating NUMERIC(3, 1) NOT NULL DEFAULT 0,
    review_count INTEGER NOT NULL DEFAULT 0
);

-- ======================
-- Events table
-- ======================
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    club_id INTEGER NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT '',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    venue_name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    capacity INTEGER NOT NULL,
    cover_image TEXT,
    participant_count INTEGER NOT NULL DEFAULT 0,
    popularity INTEGER NOT NULL DEFAULT 0,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    mood TEXT CHECK (mood IN ('energetic', 'chill', 'romantic', 'dark', 'festive')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ======================
-- Event Artists junction table
-- ======================
CREATE TABLE event_artists (
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    fee NUMERIC(10, 2),
    PRIMARY KEY (event_id, artist_id)
);

-- ======================
-- Invitations table
-- ======================
CREATE TABLE invitations (
    id SERIAL PRIMARY KEY,
    club_id INTEGER NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    artist_id INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
    message TEXT,
    fee NUMERIC(10, 2),
    date TIMESTAMP,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ======================
-- Tickets table
-- ======================
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL,
    purchase_date TIMESTAMP NOT NULL DEFAULT NOW(),
    is_used BOOLEAN NOT NULL DEFAULT false
);

-- ======================
-- Feedback table
-- ======================
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    artist_id INTEGER REFERENCES artists(id) ON DELETE SET NULL,
    club_id INTEGER REFERENCES clubs(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ======================
-- Transactions table
-- ======================
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'payment', 'refund')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ======================
-- POS tables (Employees, Devices, Tables, Orders)
-- ======================

-- Employees
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    pin TEXT NOT NULL
);

-- POS Devices
CREATE TABLE pos_devices (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    status TEXT NOT NULL,
    last_active TIMESTAMP,
    sales INTEGER
);

-- Product Categories
CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Products
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    category_id INTEGER REFERENCES product_categories(id) ON DELETE SET NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT
);

-- POS Tables
CREATE TABLE pos_tables (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    number INTEGER,
    area TEXT,
    capacity INTEGER,
    status TEXT NOT NULL,
    current_order_id INTEGER
);

-- Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES pos_tables(id) ON DELETE SET NULL,
    customer_name TEXT,
    status TEXT NOT NULL,
    total INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    payment_method TEXT,
    priority TEXT,
    estimated_completion_time TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price INTEGER,
    subtotal INTEGER NOT NULL,
    status TEXT,
    category TEXT,
    preparation_time INTEGER
);

-- POS History
CREATE TABLE pos_history (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    description TEXT,
    user_id INTEGER REFERENCES employees(id) ON DELETE SET NULL,
    user_name TEXT,
    user_role TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    amount INTEGER,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    table_id INTEGER REFERENCES pos_tables(id) ON DELETE SET NULL,
    table_name TEXT,
    details TEXT,
    status TEXT
);

-- ======================
-- Indexes pour améliorer les performances
-- ======================

-- Index pour les users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Index pour les artists
CREATE INDEX idx_artists_user_id ON artists(user_id);
CREATE INDEX idx_artists_genre ON artists(genre);

-- Index pour les clubs
CREATE INDEX idx_clubs_user_id ON clubs(user_id);
CREATE INDEX idx_clubs_city ON clubs(city);
CREATE INDEX idx_clubs_country ON clubs(country);

-- Index pour les events
CREATE INDEX idx_events_club_id ON events(club_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_city ON events(city);
CREATE INDEX idx_events_category ON events(category);

-- Index pour event_artists
CREATE INDEX idx_event_artists_event_id ON event_artists(event_id);
CREATE INDEX idx_event_artists_artist_id ON event_artists(artist_id);

-- Index pour invitations
CREATE INDEX idx_invitations_club_id ON invitations(club_id);
CREATE INDEX idx_invitations_artist_id ON invitations(artist_id);
CREATE INDEX idx_invitations_status ON invitations(status);

-- Index pour tickets
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_purchase_date ON tickets(purchase_date);

-- Index pour feedback
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_event_id ON feedback(event_id);
CREATE INDEX idx_feedback_artist_id ON feedback(artist_id);
CREATE INDEX idx_feedback_club_id ON feedback(club_id);

-- Index pour transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- Index pour POS
CREATE INDEX idx_employees_role ON employees(role);
CREATE INDEX idx_pos_devices_status ON pos_devices(status);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_available ON products(is_available);
CREATE INDEX idx_pos_tables_status ON pos_tables(status);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_pos_history_timestamp ON pos_history(timestamp);
CREATE INDEX idx_pos_history_user_id ON pos_history(user_id);
CREATE INDEX idx_pos_history_order_id ON pos_history(order_id);

-- ======================
-- Contraintes supplémentaires
-- ======================
ALTER TABLE pos_tables 
ADD CONSTRAINT fk_pos_tables_current_order 
FOREIGN KEY (current_order_id) REFERENCES orders(id) ON DELETE SET NULL;

-- ======================
-- Commentaires sur les tables
-- ======================
COMMENT ON TABLE users IS 'Table des utilisateurs de la plateforme';
COMMENT ON TABLE artists IS 'Table des artistes';
COMMENT ON TABLE clubs IS 'Table des clubs/établissements';
COMMENT ON TABLE events IS 'Table des événements';
COMMENT ON TABLE event_artists IS 'Table de liaison entre événements et artistes';
COMMENT ON TABLE invitations IS 'Table des invitations envoyées aux artistes';
COMMENT ON TABLE tickets IS 'Table des billets d événements';
COMMENT ON TABLE feedback IS 'Table des avis et commentaires';
COMMENT ON TABLE transactions IS 'Table des transactions financières';
COMMENT ON TABLE employees IS 'Table des employés du système POS';
COMMENT ON TABLE pos_devices IS 'Table des terminaux POS';
COMMENT ON TABLE product_categories IS 'Table des catégories de produits';
COMMENT ON TABLE products IS 'Table des produits disponibles';
COMMENT ON TABLE pos_tables IS 'Table des tables du restaurant/bar';
COMMENT ON TABLE orders IS 'Table des commandes';
COMMENT ON TABLE order_items IS 'Table des items de commande';
COMMENT ON TABLE pos_history IS 'Table d historique des opérations POS';

-- ======================
-- Données d'exemple (optionnel)
-- ======================
-- ======================
-- Données d'exemple pour toutes les tables
-- ======================

-- Insertion des utilisateurs
INSERT INTO users (username, password, email, first_name, last_name, role, city, country, is_verified, wallet_balance) VALUES
('admin', '$2b$10$examplehashedpassword', 'admin@nightclub.com', 'Jean', 'Dupont', 'admin', 'Paris', 'France', true, 1000.00),
('clubowner', '$2b$10$examplehashedpassword2', 'owner@lavoile.com', 'Marie', 'Martin', 'club', 'Paris', 'France', true, 5000.00),
('artist1', '$2b$10$examplehashedpassword3', 'djmax@music.com', 'Max', 'Dubois', 'artist', 'Lyon', 'France', true, 2500.00),
('artist2', '$2b$10$examplehashedpassword4', 'sarahvoice@music.com', 'Sarah', 'Petit', 'artist', 'Marseille', 'France', true, 1800.00),
('user1', '$2b$10$examplehashedpassword5', 'client1@email.com', 'Pierre', 'Durand', 'user', 'Paris', 'France', true, 150.00),
('user2', '$2b$10$examplehashedpassword6', 'client2@email.com', 'Sophie', 'Moreau', 'user', 'Lyon', 'France', true, 75.00);

-- Insertion des artistes
INSERT INTO artists (user_id, display_name, genre, bio, rate, tags, popularity) VALUES
(3, 'DJ Max', 'Electronic', 'DJ spécialisé en house et techno avec 10 ans d expérience', 500.00, '["house", "techno", "electronic"]', 85),
(4, 'Sarah Voice', 'R&B', 'Chanteuse R&B avec une voix unique et captivante', 400.00, '["r&b", "soul", "jazz"]', 78);

-- Insertion des clubs
INSERT INTO clubs (user_id, name, city, country, address, capacity, description, rating, review_count) VALUES
(2, 'La Voile Rouge', 'Saint-Tropez', 'France', 'Plage de Pampelonne', 300, 'Club de plage mythique de Saint-Tropez', 4.5, 125),
(2, 'Le Baron', 'Paris', 'France', '6 Avenue Marceau', 200, 'Club exclusif dans le 8ème arrondissement', 4.2, 89);

-- Insertion des événements
INSERT INTO events (club_id, title, description, date, start_time, end_time, location, city, venue_name, category, price, capacity, cover_image, participant_count, popularity, is_approved, mood) VALUES
(1, 'Summer Beach Party', 'Soirée spéciale été avec DJ international', '2024-07-15 22:00:00', '22:00', '06:00', 'Plage de Pampelonne', 'Saint-Tropez', 'La Voile Rouge', 'Soirée', 50.00, 300, 'beach_party.jpg', 250, 92, true, 'energetic'),
(2, 'R&B Night', 'Soirée R&B avec live performance', '2024-07-20 23:00:00', '23:00', '05:00', '6 Avenue Marceau', 'Paris', 'Le Baron', 'Concert', 40.00, 200, 'rnb_night.jpg', 180, 88, true, 'chill'),
(1, 'Techno Session', 'Nuit techno avec les meilleurs DJs', '2024-07-22 23:00:00', '23:00', '07:00', 'Plage de Pampelonne', 'Saint-Tropez', 'La Voile Rouge', 'Soirée', 45.00, 300, 'techno_session.jpg', 220, 90, true, 'dark');

-- Insertion des artistes pour événements
INSERT INTO event_artists (event_id, artist_id, fee) VALUES
(1, 1, 2000.00),
(2, 2, 1500.00),
(3, 1, 1800.00);

-- Insertion des invitations
INSERT INTO invitations (club_id, artist_id, message, fee, date, status) VALUES
(1, 2, 'Nous aimerions vous inviter pour une soirée spéciale', 1200.00, '2024-08-10 22:00:00', 'pending'),
(2, 1, 'Performance exclusive pour notre soirée anniversaire', 2500.00, '2024-08-15 23:00:00', 'accepted');

-- Insertion des billets
INSERT INTO tickets (event_id, user_id, price, purchase_date, is_used) VALUES
(1, 5, 50.00, '2024-07-10 14:30:00', false),
(1, 6, 50.00, '2024-07-11 10:15:00', false),
(2, 5, 40.00, '2024-07-12 16:45:00', false),
(3, 6, 45.00, '2024-07-13 11:20:00', false);

-- Insertion des feedbacks
INSERT INTO feedback (user_id, event_id, artist_id, club_id, rating, comment) VALUES
(5, 1, 1, 1, 5, 'Soirée incroyable ! DJ Max était au top !'),
(6, 2, 2, 2, 4, 'Très bonne performance de Sarah Voice, ambiance cozy'),
(5, 3, 1, 1, 5, 'Nuit techno mémorable, à refaire !');

-- Insertion des transactions
INSERT INTO transactions (user_id, amount, description, type) VALUES
(5, -50.00, 'Achat billet Summer Beach Party', 'payment'),
(6, -50.00, 'Achat billet Summer Beach Party', 'payment'),
(5, -40.00, 'Achat billet R&B Night', 'payment'),
(6, -45.00, 'Achat billet Techno Session', 'payment'),
(1, 100.00, 'Rechargement portefeuille', 'deposit');

-- ======================
-- Données POS (Système de point de vente)
-- ======================

-- Insertion des employés POS
INSERT INTO employees (name, role, pin) VALUES
('Thomas Serveur', 'serveur', '1234'),
('Julie Caissière', 'caissier', '5678'),
('Chef Marco', 'cuisinier', '9012'),
('Manager Dupuis', 'manager', '3456');

-- Insertion des terminaux POS
INSERT INTO pos_devices (name, location, status, last_active, sales) VALUES
('Terminal Bar Principal', 'Bar', 'active', '2024-07-14 20:30:00', 12500),
('Terminal Salle', 'Salle', 'active', '2024-07-14 21:15:00', 8900),
('Terminal Terrasse', 'Terrasse', 'inactive', '2024-07-13 23:45:00', 5600),
('Terminal VIP', 'VIP', 'active', '2024-07-14 22:30:00', 15200);

-- Insertion des catégories de produits
INSERT INTO product_categories (name, description, is_active) VALUES
('Cocktails', 'Cocktails signature et classiques', true),
('Vins', 'Vins au verre et bouteilles', true),
('Bières', 'Bières pression et bouteilles', true),
('Softs', 'Boissons non-alcoolisées', true),
('Plats', 'Carte restaurant', true),
('Snacks', 'En-cas et petits plats', true);

-- Insertion des produits
INSERT INTO products (name, description, price, category_id, is_available, image_url) VALUES
('Mojito', 'Rhum, menthe, citron vert', 12, 1, true, 'mojito.jpg'),
('Margarita', 'Tequila, triple sec, citron vert', 14, 1, true, 'margarita.jpg'),
('Cosmopolitan', 'Vodka, triple sec, cranberry', 13, 1, true, 'cosmo.jpg'),
('Vin Rouge Maison', 'Verre de vin rouge', 8, 2, true, 'vin_rouge.jpg'),
('Vin Blanc Maison', 'Verre de vin blanc', 8, 2, true, 'vin_blanc.jpg'),
('Heineken', 'Bière pression 50cl', 7, 3, true, 'heineken.jpg'),
('Coca-Cola', 'Canette 33cl', 5, 4, true, 'coca.jpg'),
('Plateau fromage', 'Assortiment de fromages', 18, 6, true, 'plateau_fromage.jpg'),
('Burger Club', 'Burger avec frites', 16, 5, true, 'burger.jpg'),
('Pizza Margherita', 'Pizza traditionnelle', 14, 5, true, 'pizza.jpg');

-- Insertion des tables
INSERT INTO pos_tables (name, number, area, capacity, status, current_order_id) VALUES
('Table 1', 1, 'Terrasse', 4, 'libre', NULL),
('Table 2', 2, 'Terrasse', 6, 'occupée', 1),
('Table 3', 3, 'Salle', 2, 'occupée', 2),
('Table VIP 1', 101, 'VIP', 8, 'réservée', NULL),
('Table 4', 4, 'Salle', 4, 'libre', NULL),
('Table 5', 5, 'Bar', 2, 'occupée', 3);

-- Insertion des commandes
INSERT INTO orders (table_id, customer_name, status, total, payment_method, priority, estimated_completion_time) VALUES
(2, 'M. Dupont', 'en cours', 54, NULL, 'normal', '2024-07-14 21:45:00'),
(3, 'Mme Martin', 'servi', 28, 'carte', 'normal', '2024-07-14 21:20:00'),
(6, NULL, 'en cours', 36, NULL, 'urgent', '2024-07-14 21:30:00'),
(NULL, 'Commande à emporter', 'prêt', 24, 'espèces', 'normal', '2024-07-14 21:15:00');

-- Insertion des items de commande
INSERT INTO order_items (order_id, product_id, quantity, price, subtotal, status, category, preparation_time) VALUES
(1, 9, 2, 16, 32, 'servi', 'nourriture', 15),
(1, 6, 3, 7, 21, 'servi', 'boisson', 2),
(1, 7, 1, 5, 5, 'servi', 'boisson', 1),
(2, 10, 1, 14, 14, 'servi', 'nourriture', 12),
(2, 4, 2, 8, 16, 'servi', 'boisson', 2),
(3, 1, 2, 12, 24, 'en préparation', 'boisson', 5),
(3, 8, 1, 18, 18, 'en préparation', 'nourriture', 10),
(4, 2, 2, 14, 28, 'prêt', 'boisson', 6);

-- Insertion de l'historique POS
INSERT INTO pos_history (type, description, user_id, user_name, user_role, amount, order_id, table_id, table_name, details, status) VALUES
('sale', 'Vente table 2', 1, 'Thomas Serveur', 'serveur', 54, 1, 2, 'Table 2', '2x Burger Club, 3x Heineken, 1x Coca-Cola', 'completed'),
('sale', 'Vente table 3', 1, 'Thomas Serveur', 'serveur', 28, 2, 3, 'Table 3', '1x Pizza, 2x Vin Rouge', 'completed'),
('order', 'Nouvelle commande bar', 2, 'Julie Caissière', 'caissier', 36, 3, 6, 'Table 5', '2x Mojito, 1x Plateau fromage', 'in_progress'),
('payment', 'Paiement commande à emporter', 2, 'Julie Caissière', 'caissier', 24, 4, NULL, NULL, '2x Margarita - Paiement espèces', 'completed'),
('sale', 'Vente VIP', 4, 'Manager Dupuis', 'manager', 120, NULL, 4, 'Table VIP 1', 'Bouteille champagne', 'completed'),
('refund', 'Remboursement', 2, 'Julie Caissière', 'caissier', -12, NULL, NULL, NULL, 'Erreur de commande', 'completed');

-- ======================
-- Mise à jour des tables avec les orders actuels
-- ======================
UPDATE pos_tables SET current_order_id = 1 WHERE id = 2;
UPDATE pos_tables SET current_order_id = 2 WHERE id = 3;
UPDATE pos_tables SET current_order_id = 3 WHERE id = 6;

-- ======================
-- Mise à jour des statistiques des devices POS
-- ======================
UPDATE pos_devices SET sales = 12500 WHERE id = 1;
UPDATE pos_devices SET sales = 8900 WHERE id = 2;
UPDATE pos_devices SET sales = 5600 WHERE id = 3;
UPDATE pos_devices SET sales = 15200 WHERE id = 4;

-- ======================
-- Index supplémentaires pour les recherches courantes
-- ======================
CREATE INDEX idx_events_is_approved ON events(is_approved);
CREATE INDEX idx_tickets_is_used ON tickets(is_used);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_pos_history_status ON pos_history(status);

-- ======================
-- Vues utiles pour les rapports
-- ======================
CREATE VIEW daily_sales AS
SELECT DATE(timestamp) as sale_date,
       SUM(amount) as total_sales,
       COUNT(*) as transaction_count
FROM pos_history 
WHERE type = 'sale' AND status = 'completed'
GROUP BY DATE(timestamp);

CREATE VIEW top_products AS
SELECT p.name as product_name,
       c.name as category,
       SUM(oi.quantity) as total_sold,
       SUM(oi.subtotal) as total_revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN product_categories c ON p.category_id = c.id
GROUP BY p.name, c.name
ORDER BY total_sold DESC;

CREATE VIEW employee_performance AS
SELECT e.name as employee_name,
       e.role,
       COUNT(ph.id) as total_operations,
       SUM(CASE WHEN ph.type = 'sale' THEN ph.amount ELSE 0 END) as total_sales
FROM employees e
LEFT JOIN pos_history ph ON e.id = ph.user_id
WHERE ph.status = 'completed'
GROUP BY e.name, e.role
ORDER BY total_sales DESC;

-- ======================
-- Fonctions utilitaires
-- ======================
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE orders 
        SET total = (
            SELECT COALESCE(SUM(subtotal), 0) 
            FROM order_items 
            WHERE order_id = NEW.order_id
        ),
        updated_at = NOW()
        WHERE id = NEW.order_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE orders 
        SET total = (
            SELECT COALESCE(SUM(subtotal), 0) 
            FROM order_items 
            WHERE order_id = OLD.order_id
        ),
        updated_at = NOW()
        WHERE id = OLD.order_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_items_change
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW EXECUTE FUNCTION update_order_total();

-- ======================
-- Message de confirmation
-- ======================
DO $$ 
BEGIN
    RAISE NOTICE 'Données d exemple insérées avec succès !';
    RAISE NOTICE '%- Utilisateurs créés', (SELECT COUNT(*) FROM users);
    RAISE NOTICE '%- Événements programmés', (SELECT COUNT(*) FROM events);
    RAISE NOTICE '%- Produits disponibles', (SELECT COUNT(*) FROM products);
    RAISE NOTICE '%- Commandes en cours', (SELECT COUNT(*) FROM orders WHERE status != ''servi'');
END $$;