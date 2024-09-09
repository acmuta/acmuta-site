import { ReactNode } from 'react';
import type { WorkShopLink } from '../../../lib/types';
import Image from 'next/image';
const GitHubIcon = <Image src="/assets/events/GHLogo.png" alt="Github" width={40} height={40} />;

const VideoIcon = <Image src="/assets/events/VideoIcon.png" alt="Video" width={40} height={40} />;

export const IconMap: Record<WorkShopLink['type'], ReactNode> = {
  github: GitHubIcon,
  video: VideoIcon,
};
