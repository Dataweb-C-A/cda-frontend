import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode } from '../../config/reducers/themeSlice';
import { RootState } from '../../config/store';

function ThemeSwitcher() {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.checked ? 'dark' : 'light';
    dispatch(setThemeMode(newMode));
  };

  return (
    <>
      {mode === 'light' ? (
        <BsFillSunFill
          size={22}
          style={{ cursor: 'pointer' }}
          onClick={() => dispatch(setThemeMode('dark'))}
        />
      ) : (
        <BsFillMoonFill
          size={21}
          style={{ cursor: 'pointer' }}
          onClick={() => dispatch(setThemeMode('light'))}
        />
      )}
    </>
  );
}

export default ThemeSwitcher;