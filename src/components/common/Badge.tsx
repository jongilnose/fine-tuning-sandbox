interface BadgeProps {
  label: string;
  color?: string;
}

export default function Badge({ label, color }: BadgeProps) {
  return (
    <>
      <span className={`bg-${color}-100 text-${color}-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-${color}-900 dark:text-${color}-300`}>
        {label}
      </span>
    </>
  );
}
