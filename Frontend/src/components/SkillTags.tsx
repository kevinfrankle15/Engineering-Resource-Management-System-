interface SkillTagsProps {
  skills: string[];
}

export default function SkillTags({ skills }: SkillTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, idx) => (
        <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
          {skill}
        </span>
      ))}
    </div>
  );
}