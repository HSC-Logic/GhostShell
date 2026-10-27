import {interpolate,useCurrentFrame,useVideoConfig} from 'remotion';
import {Frame,Kicker,colors,clamp} from './Design';
export const Opening=()=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 return <Frame chapter="01 / SIGNAL FOUND"><div style={{position:'absolute',left:80,top:150,right:80}}><Kicker>AN ABANDONED MACHINE. AN UNFINISHED STORY.</Kicker><h1 style={{fontSize:116,fontWeight:400,letterSpacing:-8,margin:'20px 0',color:colors.green}}>GhostShell<span style={{fontSize:80,opacity:Math.floor(f/(fps*.6))%2?0:1}}>_</span></h1><div style={{fontSize:42,lineHeight:1.3,maxWidth:800}}>Some processes<br/>never die.</div><div style={{marginTop:42,color:colors.dim,fontSize:21,opacity:interpolate(f,[2*fps,3*fps],[0,1],clamp)}}>A haunted terminal mystery powered by local AI.</div></div><div style={{position:'absolute',right:105,top:300,fontSize:94,color:colors.green,opacity:.4,translate:interpolate(f,[0,10*fps],['0px 5px','0px -20px'],clamp)}}>⟩_</div></Frame>;
};
