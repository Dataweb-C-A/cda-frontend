import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode } from '../../config/reducers/themeSlice';
import { RootState } from '../../config/store';

type ThemeSwitcherProps = {
  style?: React.CSSProperties;
};

function ThemeSwitcher({ style }: ThemeSwitcherProps) {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  return (
    <div style={style}>
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
    </div>
  );
}

export default ThemeSwitcher;