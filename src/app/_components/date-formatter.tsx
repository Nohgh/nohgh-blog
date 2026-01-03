import { parseISO, format } from "date-fns";

type Props = {
  dateString: string;
  isYear?: boolean;
};

const DateFormatter = ({ dateString, isYear = false }: Props) => {
  const date = parseISO(dateString);
  return (
    <time dateTime={dateString}>
      {format(date, isYear ? "yyyy년 MM월 d일" : "MM. dd")}
    </time>
  );
};

export default DateFormatter;
