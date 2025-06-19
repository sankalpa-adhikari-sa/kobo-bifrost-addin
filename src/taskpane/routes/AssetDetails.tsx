import { useParams } from "react-router";

const AssetDetails = () => {
  const { uid } = useParams<{ uid: string }>();
  return <div>helo {uid}</div>;
};
export default AssetDetails;
