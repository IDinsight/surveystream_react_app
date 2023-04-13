import Logo from "./../../assets/logo.svg";

function Header({ items }: { items?: any }) {
  const NavItems: any = items;

  return (
    <header className="flex h-[70px] bg-geekblue-9">
      <div className="flex items-center">
        <img className="pl-6 pr-12" src={Logo} alt="SurveyStream Logo" />
      </div>
      {items ? <NavItems /> : null}
    </header>
  );
}

export default Header;
