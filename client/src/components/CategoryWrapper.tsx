import { FC } from "react";
import { useParams } from "react-router-dom";
import SingleCategory from "../pages/SingleCategory";

const CategoryWrapper: FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>(); // Extract categoryName from the URL

  if (!categoryName) {
    // If categoryName is missing, you can handle it (e.g., show a 404 or an error)
    return <div>Category not found</div>;
  }

  return <SingleCategory categoryName={categoryName} />;
};

export default CategoryWrapper;
