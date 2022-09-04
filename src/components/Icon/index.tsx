import classnames from "classnames";

type Props = {
  type: string;
  className?: string;
  onClick?: () => void;
};

const Icon = ({ type, className, onClick }: Props) => {
  return (
    <svg
      className={classnames("icon", className)}
      onClick={onClick}
      aria-hidden="true"
    >
      <use xlinkHref={`#${type}`} />
    </svg>
  );
};

export default Icon;
