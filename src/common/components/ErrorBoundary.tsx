import { Component, ErrorInfo } from "react";

type TProps = {
  hasError?: boolean;
};
type TState = {
  hasError: boolean;
};
export class ErrorBoundary extends Component<TProps, TState> {
  constructor(props: TProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
    this.setState({ hasError: true });
  }

  render() {
    const RenderComponent = this.state.hasError ? (
      <h1>Что-то пошло не так.</h1>
    ) : (
      this.props.children
    );

    return RenderComponent;
  }
}
