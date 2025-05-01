interface ItemCardImageProps {
  imageUrl: string;
  name: string;
  isHovered: boolean;
}

export const ItemCardImage = ({ imageUrl, name, isHovered }: ItemCardImageProps) => {
  return (
    <div className="h-48 overflow-hidden rounded-md mb-3 bg-gradient-to-b from-cyber-blue to-cyber-blue-dark">
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-contain transition-transform duration-700"
        style={{
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }}
        loading="lazy"
        onError={(e) => {
          const target = e.currentTarget;
          // Try different image URLs if the main one fails
          if (target.src !== imageUrl) {
            target.onerror = null; // Prevent infinite loop
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMxYTFhMmUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzliODdmNSIgc3R5bGU9ImZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDE2cHg7Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
          } else if (imageUrl.includes('fortnite-api.com')) {
            // Try alternate domain if fortnite-api.com fails
            target.src = imageUrl.replace('fortnite-api.com', 'fortniteapi.io');
          } else {
            target.onerror = null;
            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiMxYTFhMmUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzliODdmNSIgc3R5bGU9ImZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyBmb250LXNpemU6IDE2cHg7Ij5JbWFnZSBub3QgYXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
          }
        }}
      />
    </div>
  );
};
