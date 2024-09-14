import { title } from "@/components/primitives";

export default function Docs({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className={title()}>Docs{params.id}</h1>
    </div>
  );
}
