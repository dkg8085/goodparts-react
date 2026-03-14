import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import TaxonomyPosts from "./TaxonomyPosts";
import SinglePostLayout from "./SinglePostLayout";

export default function SmartRoute() {
  const { slug } = useParams();
  const { menus } = useSelector((state) => state.menus);
  const assignTaxonomies = useSelector((state) => state.auth.assignTaxonomies);

  const isTaxonomySlug =
    assignTaxonomies.includes(slug) ||
    (menus &&
      menus.some((m) => {
        let path = m.url || "";
        if (path.startsWith("http")) {
          try {
            path = new URL(path).pathname;
          } catch (_) {}
        }
        return path.replace(/^\/|\/$/g, "") === slug;
      }));

  if (isTaxonomySlug) {
    localStorage.setItem("selectedTaxonomy", slug);
    return <TaxonomyPosts />;
  }

  return <SinglePostLayout />;
}