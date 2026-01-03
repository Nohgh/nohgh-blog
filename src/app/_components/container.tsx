type Props = {
  children?: React.ReactNode;
};

const Container = ({ children }: Props) => {
  return <div className="container mx-auto px-4 lg:px-32 xl:px-80">{children}</div>;
};

export default Container;
