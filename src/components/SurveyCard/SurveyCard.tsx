import { Link } from "react-router-dom";

function SurveyCard({
  title,
  link,
  start,
  end,
}: {
  title: string;
  link: string;
  start: string;
  end: string;
}) {
  return (
    <div className="mt-4 mr-6 p-4 w-[270px] h-[132px] bg-gray-1 rounded-sm shadow-[0_0_4px_rgba(0,0,0,0.08)]">
      <Link
        to={link}
        className="font-inter font-medium text-base text-geekblue-7 no-underline h-12 inline-block"
      >
        {title}
      </Link>
      <div className="mt-1 flex justify-between font-inter text-xs leading-[20px] text-gray-7">
        <p className="mb-0">Started on</p>
        <p className="mb-0">{start}</p>
      </div>
      <div className="flex justify-between font-inter text-xs leading-[20px] text-gray-7">
        <p className="mb-0">Ending on</p>
        <p className="mb-0">{end}</p>
      </div>
    </div>
  );
}

export default SurveyCard;
