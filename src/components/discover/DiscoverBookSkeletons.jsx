import { GridLayout, ListLayout } from '../bookshelf/styles';
import {
  ListSkeletonCard,
  ListSkeletonCover,
  ListSkeletonText,
  SkeletonCard,
  SkeletonCover,
  SkeletonLine,
  SkeletonText,
} from './styles';

function DiscoverBookSkeletons({ viewMode }) {
  if (viewMode === 'list') {
    return (
      <ListLayout>
        {Array.from({ length: 6 }, (_, i) => (
          <ListSkeletonCard key={i}>
            <ListSkeletonCover />
            <ListSkeletonText>
              <SkeletonLine $height="22px" $width="70%" />
              <SkeletonLine $height="14px" $width="40%" />
              <SkeletonLine $height="13px" $width="90%" />
              <SkeletonLine $height="13px" $width="75%" />
            </ListSkeletonText>
          </ListSkeletonCard>
        ))}
      </ListLayout>
    );
  }

  return (
    <GridLayout>
      {Array.from({ length: 8 }, (_, i) => (
        <SkeletonCard key={i}>
          <SkeletonCover />
          <SkeletonText>
            <SkeletonLine $height="13px" $width="90%" />
            <SkeletonLine $height="11px" $width="60%" />
          </SkeletonText>
        </SkeletonCard>
      ))}
    </GridLayout>
  );
}

export default DiscoverBookSkeletons;
