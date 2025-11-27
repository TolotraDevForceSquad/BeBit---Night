import { Club } from "@shared/schema";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface ClubCardProps {
  club: Club;
}

export default function ClubCard({ club }: ClubCardProps) {
  // Calculate rating stars
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fas fa-star text-yellow-500 text-xs mr-1"></i>);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-500 text-xs mr-1"></i>);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fas fa-star text-gray-500 text-xs mr-1"></i>);
    }
    
    return stars;
  };

  return (
    <div className="bg-card rounded-xl overflow-hidden group hover:bg-muted transition-all">
      <div className="flex items-center p-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden mr-4">
          <img 
            src={club.profileImage} 
            alt={club.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium text-lg">{club.name}</h3>
          <div className="text-sm text-muted-foreground">{club.city}, {club.country}</div>
          <div className="flex items-center mt-1">
            {renderRatingStars(club.rating)}
            <span className="text-xs text-muted-foreground ml-1">({club.reviewCount})</span>
          </div>
        </div>
        <Link href={`/clubs/${club.id}`}>
          <a className="ml-auto bg-muted group-hover:bg-card w-10 h-10 rounded-full flex items-center justify-center">
            <ChevronRight className="h-5 w-5 text-secondary" />
          </a>
        </Link>
      </div>
    </div>
  );
}
