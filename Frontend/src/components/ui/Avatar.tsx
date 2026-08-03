interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
};

const Avatar = ({ src, name, size = "md" }: AvatarProps) => {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        className={`${sizeMap[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 font-bold text-white`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
