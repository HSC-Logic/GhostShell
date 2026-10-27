import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Frame,Kicker,Terminal,colors} from './Design';
export const Checkpoint=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <Frame chapter="03 / OPEN THE ARCHIVE"><div style={{position:'absolute',left:70,right:70,top:105}}><Kicker>DISCOVER. DECODE. UNLOCK.</Kicker><h2 style={{fontSize:43,fontWeight:400,margin:'0 0 30px'}}>The evidence opens the next door.</h2>{f/fps<7?<Terminal command="inspect /archive keep" output={'ARCHIVE MOUNTED / ACT II: Borrowed Light.\nRead /archive/consent.txt.'}/>:<Terminal key="counts" start={7} command="cat /archive/counts.csv" output={'project,surviving_mirrors\nlantern,12\nlowtide,7\nsmallhours,4'}/>}<div style={{marginTop:25,color:colors.dim,fontSize:20}}>Application code validates answers and controls progression.</div></div></Frame>;
};
