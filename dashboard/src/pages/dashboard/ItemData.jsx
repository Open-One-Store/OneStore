import { useParams } from "react-router-dom";

export default function ItemData() {
  const { id } = useParams();
  return (
    <div>
      <h1>Item Data</h1>
      <p>Item ID: {id}</p>
    </div>
  );
}
