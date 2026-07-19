export default function Logo({ size = "md", className = "" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className={`font-serif font-black uppercase tracking-[-0.06em] ${sizes[size] || sizes.md} text-gray-900 dark:text-white`}>
        Velora
      </span>
    </span>
  );
}
