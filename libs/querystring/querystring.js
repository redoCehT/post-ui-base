// There's CDN script for query-string package
// Once loaded, it will add a global object named 'Qs'
const queryString = window.Qs;

// TODO: Handle in case window.Qs is not loaded
export default queryString;