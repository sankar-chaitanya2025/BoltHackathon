import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/store/useSettings';

export default function SettingsPanel() {
  const { brightness, motionIntensity, soundSensitivity, updateSettings } = useSettings();

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="brightness">Brightness ({brightness}%)</Label>
        <Slider
          id="brightness"
          min={50}
          max={100}
          step={1}
          value={[brightness]}
          onValueChange={(value) => updateSettings({ brightness: value[0] })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="motion">Motion Intensity ({motionIntensity}%)</Label>
        <Slider
          id="motion"
          min={0}
          max={100}
          step={1}
          value={[motionIntensity]}
          onValueChange={(value) => updateSettings({ motionIntensity: value[0] })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sound">Sound Sensitivity ({soundSensitivity}dB)</Label>
        <Slider
          id="sound"
          min={0}
          max={100}
          step={1}
          value={[soundSensitivity]}
          onValueChange={(value) => updateSettings({ soundSensitivity: value[0] })}
          className="w-full"
        />
      </div>
    </div>
  );
}