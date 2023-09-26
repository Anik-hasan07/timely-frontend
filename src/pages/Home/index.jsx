import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Flat from '../../components/Flat';
import { clearSetSelectedProject } from '../../redux/reducers/projectReducer';
import WorkSection from './components/WorkSection';

export function Home() {
  const disPatch = useDispatch();
  useEffect(() => {
    disPatch(clearSetSelectedProject());
  }, [disPatch]);

  return (
    <div className="layoutContainer">
      <div className="css-160xfzw">
        <div className="css-1pa8dxh">
          <div className="css-6da72m">
            <h1 tabIndex="-1" className="css-kwc091">
              Your work
            </h1>
          </div>
        </div>
      </div>
      <Flat />
      <WorkSection />
    </div>
  );
}
