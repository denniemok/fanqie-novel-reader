import { GridLayout, ListLayout } from '../layout/BookListLayouts';
import {
  DiscoverListSkeletonCard,
  ListSkeletonCover,
  ListSkeletonText,
  DiscoverGridSkeletonCard,
  SkeletonCover,
  SkeletonLine,
  SkeletonText,
} from './styles';

function DiscoverBookSkeletons({ viewMode }) {
  if (viewMode === 'list') {
    return (
      <ListLayout>
        {Array.from({ length: 6 }, (_, i) => (
          <DiscoverListSkeletonCard key={i}>
            <ListSkeletonCover />
            <ListSkeletonText>
              <SkeletonLine $height="22px" $width="70%" />
              <SkeletonLine $height="14px" $width="40%" />
              <SkeletonLine $height="13px" $width="90%" />
              <SkeletonLine $height="13px" $width="75%" />
            </ListSkeletonText>
          </DiscoverListSkeletonCard>
        ))}
      </ListLayout>
    );
  }

  return (
    <GridLayout>
      {Array.from({ length: 8 }, (_, i) => (
        <DiscoverGridSkeletonCard key={i}>
          <SkeletonCover />
          <SkeletonText>
            <SkeletonLine $height="13px" $width="90%" />
            <SkeletonLine $height="11px" $width="60%" />
          </SkeletonText>
        </DiscoverGridSkeletonCard>
      ))}
    </GridLayout>
  );
}

export default DiscoverBookSkeletons;
