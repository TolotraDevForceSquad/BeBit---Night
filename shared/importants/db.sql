-- Création de la table users (base pour plusieurs relations)
CREATE TABLE public.users (
    id INTEGER NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT DEFAULT 'user'::TEXT NOT NULL,
    profile_image TEXT,
    city TEXT DEFAULT ''::TEXT,
    country TEXT DEFAULT ''::TEXT,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    wallet_balance NUMERIC(10,2) DEFAULT 0 NOT NULL,
    is_verified BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_username_unique UNIQUE (username)
);

-- Séquence pour la table users
CREATE SEQUENCE public.users_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);

-- Commentaire : Règle de gestion pour users
-- La table users est référencée par artists, clubs, feedback, tickets, transactions et pos_history.
-- Règle : Un utilisateur ne peut être supprimé si des enregistrements liés (par exemple, artists ou clubs) existent,
-- pour maintenir l'intégrité des données (ON DELETE RESTRICT implicite).

-- Création de la table artists
CREATE TABLE public.artists (
    id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    display_name TEXT NOT NULL,
    genre TEXT NOT NULL,
    bio TEXT,
    rate NUMERIC(10,2) DEFAULT 0 NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb NOT NULL,
    popularity INTEGER DEFAULT 0 NOT NULL,
    CONSTRAINT artists_pkey PRIMARY KEY (id),
    CONSTRAINT artists_user_id_unique UNIQUE (user_id),
    CONSTRAINT artists_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Séquence pour la table artists
CREATE SEQUENCE public.artists_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.artists_id_seq OWNED BY public.artists.id;
ALTER TABLE ONLY public.artists ALTER COLUMN id SET DEFAULT nextval('public.artists_id_seq'::regclass);

-- Commentaire : Règle de gestion pour artists
-- La table artists est liée à users via user_id (relation 1:1) et à event_artists, feedback, et invitations via id.
-- Règle : Un artiste ne peut être créé que si l'utilisateur associé (user_id) existe dans la table users,
-- et un artiste ne peut être supprimé si des enregistrements liés dans event_artists ou invitations existent.

-- Création de la table clubs
CREATE TABLE public.clubs (
    id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    capacity INTEGER NOT NULL,
    description TEXT,
    profile_image TEXT,
    rating NUMERIC(3,1) DEFAULT 0 NOT NULL,
    review_count INTEGER DEFAULT 0 NOT NULL,
    CONSTRAINT clubs_pkey PRIMARY KEY (id),
    CONSTRAINT clubs_user_id_unique UNIQUE (user_id),
    CONSTRAINT clubs_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Séquence pour la table clubs
CREATE SEQUENCE public.clubs_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.clubs_id_seq OWNED BY public.clubs.id;
ALTER TABLE ONLY public.clubs ALTER COLUMN id SET DEFAULT nextval('public.clubs_id_seq'::regclass);

-- Commentaire : Règle de gestion pour clubs
-- La table clubs est liée à users via user_id (relation 1:1) et à events, feedback, et invitations via id.
-- Règle : Un club ne peut être créé que si l'utilisateur associé (user_id) existe dans la table users,
-- et un club ne peut être supprimé si des événements ou invitations liés existent dans les tables correspondantes.

-- Création de la table employees
CREATE TABLE public.employees (
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    pin TEXT NOT NULL,
    CONSTRAINT employees_pkey PRIMARY KEY (id)
);

-- Séquence pour la table employees
CREATE SEQUENCE public.employees_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;
ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);

-- Commentaire : Règle de gestion pour employees
-- La table employees est référencée par pos_history via user_id.
-- Règle : Un employé ne peut être supprimé si des enregistrements dans pos_history le référencent,
-- pour préserver l'historique des actions effectuées par cet employé.

-- Création de la table product_categories
CREATE TABLE public.product_categories (
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    CONSTRAINT product_categories_pkey PRIMARY KEY (id)
);

-- Séquence pour la table product_categories
CREATE SEQUENCE public.product_categories_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.product_categories_id_seq OWNED BY public.product_categories.id;
ALTER TABLE ONLY public.product_categories ALTER COLUMN id SET DEFAULT nextval('public.product_categories_id_seq'::regclass);

-- Commentaire : Règle de gestion pour product_categories
-- La table product_categories est référencée par products via category_id.
-- Règle : Une catégorie de produit ne peut être supprimée si des produits associés existent dans la table products,
-- pour éviter des produits orphelins sans catégorie.

-- Création de la table products
CREATE TABLE public.products (
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    category_id INTEGER,
    is_available BOOLEAN DEFAULT true NOT NULL,
    image_url TEXT,
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_category_id_product_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.product_categories(id)
);

-- Séquence pour la table products
CREATE SEQUENCE public.products_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;
ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);

-- Commentaire : Règle de gestion pour products
-- La table products est liée à product_categories via category_id et à order_items via id.
-- Règle : Un produit ne peut être supprimé si des éléments de commande (order_items) le référencent,
-- pour maintenir l'intégrité des commandes existantes.

-- Création de la table pos_tables
CREATE TABLE public.pos_tables (
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    number INTEGER,
    area TEXT,
    capacity INTEGER,
    status TEXT NOT NULL,
    current_order_id INTEGER,
    CONSTRAINT pos_tables_pkey PRIMARY KEY (id)
);

-- Séquence pour la table pos_tables
CREATE SEQUENCE public.pos_tables_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.pos_tables_id_seq OWNED BY public.pos_tables.id;
ALTER TABLE ONLY public.pos_tables ALTER COLUMN id SET DEFAULT nextval('public.pos_tables_id_seq'::regclass);

-- Commentaire : Règle de gestion pour pos_tables
-- La table pos_tables est référencée par orders et pos_history via table_id.
-- Règle : Une table POS ne peut être supprimée si des commandes (orders) ou des enregistrements d'historique (pos_history)
-- la référencent, pour préserver l'intégrité des données de commande et d'historique.

-- Création de la table orders
CREATE TABLE public.orders (
    id INTEGER NOT NULL,
    table_id INTEGER,
    customer_name TEXT,
    status TEXT NOT NULL,
    total INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    payment_method TEXT,
    priority TEXT,
    estimated_completion_time TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_table_id_pos_tables_id_fk FOREIGN KEY (table_id) REFERENCES public.pos_tables(id)
);

-- Séquence pour la table orders
CREATE SEQUENCE public.orders_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);

-- Commentaire : Règle de gestion pour orders
-- La table orders est liée à pos_tables via table_id et à order_items et pos_history via id.
-- Règle : Une commande ne peut être supprimée si des éléments de commande (order_items) ou des enregistrements d'historique (pos_history)
-- la référencent, pour maintenir l'intégrité des détails de commande et de l'historique.

-- Création de la table order_items
CREATE TABLE public.order_items (
    id INTEGER NOT NULL,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price INTEGER,
    subtotal INTEGER NOT NULL,
    status TEXT,
    category TEXT,
    preparation_time INTEGER,
    notes TEXT,
    CONSTRAINT order_items_pkey PRIMARY KEY (id),
    CONSTRAINT order_items_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id),
    CONSTRAINT order_items_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id)
);

-- Séquence pour la table order_items
CREATE SEQUENCE public.order_items_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;
ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);

-- Commentaire : Règle de gestion pour order_items
-- La table order_items est liée à orders via order_id et à products via product_id.
-- Règle : Un élément de commande ne peut être créé que si la commande (order_id) et le produit (product_id) existent,
-- et la suppression d'un élément est restreinte si des enregistrements dépendants existent (par exemple, dans un historique).

-- Création de la table pos_devices
CREATE TABLE public.pos_devices (
    id INTEGER NOT NULL,
    name TEXT NOT NULL,
    location TEXT,
    status TEXT NOT NULL,
    last_active TIMESTAMP WITHOUT TIME ZONE,
    sales INTEGER,
    CONSTRAINT pos_devices_pkey PRIMARY KEY (id)
);

-- Séquence pour la table pos_devices
CREATE SEQUENCE public.pos_devices_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.pos_devices_id_seq OWNED BY public.pos_devices.id;
ALTER TABLE ONLY public.pos_devices ALTER COLUMN id SET DEFAULT nextval('public.pos_devices_id_seq'::regclass);

-- Commentaire : Règle de gestion pour pos_devices
-- La table pos_devices n'a pas de clés étrangères directes, mais peut être référencée dans pos_history via des relations implicites.
-- Règle : Les terminaux POS doivent être marqués comme actifs (status = 'active') pour être utilisés dans les opérations de caisse.

-- Création de la table events
CREATE TABLE public.events (
    id INTEGER NOT NULL,
    club_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    location TEXT NOT NULL,
    city TEXT DEFAULT ''::TEXT NOT NULL,
    country TEXT DEFAULT ''::TEXT NOT NULL,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    venue_name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    capacity INTEGER NOT NULL,
    cover_image TEXT,
    participant_count INTEGER DEFAULT 0 NOT NULL,
    popularity INTEGER DEFAULT 0 NOT NULL,
    is_approved BOOLEAN DEFAULT false NOT NULL,
    mood TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT events_pkey PRIMARY KEY (id),
    CONSTRAINT events_club_id_clubs_id_fk FOREIGN KEY (club_id) REFERENCES public.clubs(id)
);

-- Séquence pour la table events
CREATE SEQUENCE public.events_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;
ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);

-- Commentaire : Règle de gestion pour events
-- La table events est liée à clubs via club_id et à event_artists, feedback, et tickets via id.
-- Règle : Un événement ne peut être créé que si le club associé (club_id) existe,
-- et un événement ne peut être supprimé si des tickets ou des relations avec des artistes existent.

-- Création de la table event_artists
CREATE TABLE public.event_artists (
    event_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    fee NUMERIC(10,2),
    CONSTRAINT event_artists_event_id_artist_id_pk PRIMARY KEY (event_id, artist_id),
    CONSTRAINT event_artists_event_id_events_id_fk FOREIGN KEY (event_id) REFERENCES public.events(id),
    CONSTRAINT event_artists_artist_id_artists_id_fk FOREIGN KEY (artist_id) REFERENCES public.artists(id)
);

-- Commentaire : Règle de gestion pour event_artists
-- La table event_artists est une table de liaison entre events et artists.
-- Règle : Une relation artiste-événement ne peut être créée que si l'événement (event_id) et l'artiste (artist_id) existent,
-- et la suppression est restreinte si d'autres enregistrements dépendants (par exemple, feedback) existent.

-- Création de la table feedback
CREATE TABLE public.feedback (
    id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    artist_id INTEGER,
    club_id INTEGER,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT feedback_pkey PRIMARY KEY (id),
    CONSTRAINT feedback_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id),
    CONSTRAINT feedback_event_id_events_id_fk FOREIGN KEY (event_id) REFERENCES public.events(id),
    CONSTRAINT feedback_artist_id_artists_id_fk FOREIGN KEY (artist_id) REFERENCES public.artists(id),
    CONSTRAINT feedback_club_id_clubs_id_fk FOREIGN KEY (club_id) REFERENCES public.clubs(id)
);

-- Séquence pour la table feedback
CREATE SEQUENCE public.feedback_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.feedback_id_seq OWNED BY public.feedback.id;
ALTER TABLE ONLY public.feedback ALTER COLUMN id SET DEFAULT nextval('public.feedback_id_seq'::regclass);

-- Commentaire : Règle de gestion pour feedback
-- La table feedback est liée à users, events, artists, et clubs via leurs clés respectives.
-- Règle : Un feedback ne peut être créé que si l'utilisateur, l'événement, et éventuellement l'artiste ou le club existent,
-- et la suppression est restreinte pour préserver l'historique des évaluations.

-- Création de la table invitations
CREATE TABLE public.invitations (
    id INTEGER NOT NULL,
    club_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    message TEXT,
    fee NUMERIC(10,2),
    date TIMESTAMP WITHOUT TIME ZONE,
    status TEXT DEFAULT 'pending'::TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT invitations_pkey PRIMARY KEY (id),
    CONSTRAINT invitations_club_id_clubs_id_fk FOREIGN KEY (club_id) REFERENCES public.clubs(id),
    CONSTRAINT invitations_artist_id_artists_id_fk FOREIGN KEY (artist_id) REFERENCES public.artists(id)
);

-- Séquence pour la table invitations
CREATE SEQUENCE public.invitations_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.invitations_id_seq OWNED BY public.invitations.id;
ALTER TABLE ONLY public.invitations ALTER COLUMN id SET DEFAULT nextval('public.invitations_id_seq'::regclass);

-- Commentaire : Règle de gestion pour invitations
-- La table invitations est liée à clubs et artists via club_id et artist_id.
-- Règle : Une invitation ne peut être créée que si le club et l'artiste existent,
-- et la suppression est restreinte pour préserver l'historique des invitations.

-- Création de la table tickets
CREATE TABLE public.tickets (
    id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    purchase_date TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    is_used BOOLEAN DEFAULT false NOT NULL,
    CONSTRAINT tickets_pkey PRIMARY KEY (id),
    CONSTRAINT tickets_event_id_events_id_fk FOREIGN KEY (event_id) REFERENCES public.events(id),
    CONSTRAINT tickets_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Séquence pour la table tickets
CREATE SEQUENCE public.tickets_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;
ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);

-- Commentaire : Règle de gestion pour tickets
-- La table tickets est liée à events et users via event_id et user_id.
-- Règle : Un ticket ne peut être créé que si l'événement et l'utilisateur existent,
-- et la suppression est restreinte pour préserver l'historique des achats de tickets.

-- Création de la table transactions
CREATE TABLE public.transactions (
    id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    CONSTRAINT transactions_pkey PRIMARY KEY (id),
    CONSTRAINT transactions_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Séquence pour la table transactions
CREATE SEQUENCE public.transactions_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;
ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);

-- Commentaire : Règle de gestion pour transactions
-- La table transactions est liée à users via user_id.
-- Règle : Une transaction ne peut être créée que si l'utilisateur associé existe,
-- et la suppression est restreinte pour préserver l'historique financier.

-- Création de la table pos_history
CREATE TABLE public.pos_history (
    id INTEGER NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    user_id INTEGER,
    user_name TEXT,
    user_role TEXT,
    "timestamp" TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
    amount INTEGER,
    order_id INTEGER,
    table_id INTEGER,
    table_name TEXT,
    details TEXT,
    status TEXT,
    CONSTRAINT pos_history_pkey PRIMARY KEY (id),
    CONSTRAINT pos_history_user_id_employees_id_fk FOREIGN KEY (user_id) REFERENCES public.employees(id),
    CONSTRAINT pos_history_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id),
    CONSTRAINT pos_history_table_id_pos_tables_id_fk FOREIGN KEY (table_id) REFERENCES public.pos_tables(id)
);

-- Séquence pour la table pos_history
CREATE SEQUENCE public.pos_history_id_seq
    AS INTEGER
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.pos_history_id_seq OWNED BY public.pos_history.id;
ALTER TABLE ONLY public.pos_history ALTER COLUMN id SET DEFAULT nextval('public.pos_history_id_seq'::regclass);

-- Commentaire : Règle de gestion pour pos_history
-- La table pos_history est liée à employees, orders, et pos_tables via user_id, order_id, et table_id.
-- Règle : Un enregistrement d'historique POS ne peut être créé que si l'employé, la commande, ou la table associés existent,
-- et la suppression est restreinte pour préserver l'historique des actions POS.