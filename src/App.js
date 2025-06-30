import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Components/about";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
        </Switch>
      </Router>
    </>
  );
}

export default App;
