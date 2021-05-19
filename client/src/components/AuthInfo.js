const AuthInfo = ({ auth, setAuth }) => {
  if (!auth) {
    return null;
  }
  return (
    <div>
      <h2>
        Logged as {auth.profileObj.email}{" "}
        <button onClick={() => setAuth(null)}>Logout?</button>
      </h2>
    </div>
  );
};
export default AuthInfo;
