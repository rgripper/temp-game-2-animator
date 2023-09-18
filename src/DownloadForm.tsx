import { useState } from 'react';
import type { Pose } from './useEstimator';
import { FrameEstimationDisplayList } from './FrameEstimationDisplayList';
import { Button } from './base/buttons';
import { Input } from './base/inputs';
import { Animator } from './animator/Animator';

export function DownloadForm(props: { frames: ImageData[]; }) {
  const [poses, setPoses] = useState<Pose[] | null>(null);
  const [name, setName] = useState('');
  const canSubmit = !!name && !!poses;

  return (
    <form
      className={`m-8 flex flex-col items-center`}
      onSubmit={() => canSubmit && save({ name, poses })}
    >
      <div className={`mt-8`}>
        <FrameEstimationDisplayList frames={props.frames} onComplete={setPoses} />
      </div>
      <div className={`mt-8`}>
        <Animator poses={poses} />
      </div>
      <div className={`mt-8`}>
        <Input type="text" value={name} onChange={(ev) => setName(ev.currentTarget.value)} />
      </div>
      <button className={`btn btn-primary mt-8 cursor-pointer`} type="submit" disabled={!canSubmit}>
        Save
      </button>
    </form>
  );
}

const save = (values: { poses: Pose[]; name: string }) => {
  const a = document.createElement('a');
  a.download = `${values.name}.json`;
  a.href = `data:text/plain;charset=utf-8, ${encodeURIComponent(JSON.stringify(values))}`;
  a.click();
};
