import {Composition,Series,useVideoConfig} from 'remotion';
import {Opening} from './Opening';
import {Investigation} from './Investigation';
import {Checkpoint} from './Checkpoint';
import {Choice} from './Choice';
import {LocalAI} from './LocalAI';
import {Closing} from './Closing';
export const GhostShellVideo=()=>{
 const {fps}=useVideoConfig();
 return <Series>
 <Series.Sequence name="Signal found" durationInFrames={10*fps} premountFor={fps}><Opening/></Series.Sequence>
 <Series.Sequence name="Follow the evidence" durationInFrames={16*fps} premountFor={fps}><Investigation/></Series.Sequence>
 <Series.Sequence name="Open the archive" durationInFrames={14*fps} premountFor={fps}><Checkpoint/></Series.Sequence>
 <Series.Sequence name="The final choice" durationInFrames={12*fps} premountFor={fps}><Choice/></Series.Sequence>
 <Series.Sequence name="Why open innovation matters" durationInFrames={18*fps} premountFor={fps}><LocalAI/></Series.Sequence>
 <Series.Sequence name="Enter GhostShell" durationInFrames={10*fps} premountFor={fps}><Closing/></Series.Sequence>
 </Series>;
};
export const MyComposition=()=> <>
 <Composition id="GhostShell" component={GhostShellVideo} durationInFrames={2400} fps={30} width={1280} height={720}/>
 <Composition id="Opening" component={Opening} durationInFrames={300} fps={30} width={1280} height={720}/>
 <Composition id="Investigation" component={Investigation} durationInFrames={480} fps={30} width={1280} height={720}/>
 <Composition id="Checkpoint" component={Checkpoint} durationInFrames={420} fps={30} width={1280} height={720}/>
 <Composition id="Choice" component={Choice} durationInFrames={360} fps={30} width={1280} height={720}/>
 <Composition id="LocalAI" component={LocalAI} durationInFrames={540} fps={30} width={1280} height={720}/>
 <Composition id="Closing" component={Closing} durationInFrames={300} fps={30} width={1280} height={720}/>
</>;
