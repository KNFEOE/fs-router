import { Result } from "antd";
import { isRouteErrorResponse, useRouteError } from "react-router";

const Error = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return <Result status={'error'} title={error.statusText} subTitle={error.data} />;
  }

	return <Result status="500" title="500" subTitle="Admin 页面错误" />;
};

export default Error;
