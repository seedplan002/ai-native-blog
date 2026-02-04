const PAGE_NOT_FOUND_TITLE = '404 - Page Not Found';
const PAGE_NOT_FOUND_MESSAGE = 'The page you are looking for does not exist.';

const NotFound = () => {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        {PAGE_NOT_FOUND_TITLE}
      </h1>
      <p className="mb-4">{PAGE_NOT_FOUND_MESSAGE}</p>
    </section>
  );
};

export default NotFound;
