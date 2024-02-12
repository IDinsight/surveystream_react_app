import { Button, Result } from "antd";

interface IErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: IErrorFallbackProps) => {
  return (
    <Result
      status="warning"
      title="SurveyStream encountered an error while loading your data."
      extra={
        <>
          <p className="font-bold">
            If this issue persists please contact the SurveyStream team for
            support.
          </p>
          <br />
          {window.location.hostname.includes("localhost") ||
          window.location.hostname.includes("stg") ? (
            <pre>{error.message}</pre>
          ) : null}
          <br />
          <Button type="primary" key="console" onClick={resetErrorBoundary}>
            Try again
          </Button>
        </>
      }
    />
  );
};

export default ErrorFallback;
