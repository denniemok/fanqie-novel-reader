import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { IconButton } from './IconButton';

export const FORWARD_BUTTON_TITLE = '前進';

function ForwardButton({ title = FORWARD_BUTTON_TITLE }) {
  const navigate = useNavigate();
  const navigation = typeof window !== 'undefined' ? window.navigation : undefined;
  const [canGoForward, setCanGoForward] = useState(
    () => navigation?.canGoForward ?? true,
  );

  useEffect(() => {
    if (!navigation) return undefined;

    const update = () => setCanGoForward(navigation.canGoForward);
    update();
    navigation.addEventListener('navigate', update);
    navigation.addEventListener('currententrychange', update);
    return () => {
      navigation.removeEventListener('navigate', update);
      navigation.removeEventListener('currententrychange', update);
    };
  }, [navigation]);

  return (
    <IconButton
      type="button"
      title={title}
      aria-label={title}
      disabled={!canGoForward}
      onClick={() => navigate(1)}
    >
      <ArrowRight size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

export default ForwardButton;
