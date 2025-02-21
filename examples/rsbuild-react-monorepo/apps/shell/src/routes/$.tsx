import { Button, Result } from "antd";
import { useNavigate } from "react-router";

export default function Page() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist from Shell app"
      extra={<Button type="primary" onClick={() => navigate("/")}>
        Back Home
      </Button>}
    />
  );
}
