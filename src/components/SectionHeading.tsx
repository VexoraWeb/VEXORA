import { Reveal } from "@/components/Reveal";

interface Props {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  align?: "left" | "center";
}

export function SectionHeading({ eyebrow, title, text, align = "center" }: Props) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="h-display mt-5 text-3xl sm:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-relaxed text-white/55 sm:text-lg">{text}</p>}
    </Reveal>
  );
}
