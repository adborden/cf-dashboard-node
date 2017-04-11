
import path from 'path';

function home(req, res) {
  console.log(path.join(path.dirname(path.dirname(__dirname)), 'static', 'index.html'));
  res.sendFile(path.join(path.dirname(path.dirname(__dirname)), 'static', 'index.html'));
}

export default home;
