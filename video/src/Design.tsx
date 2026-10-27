import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
export const colors={green:'#b1ed95',text:'#e7eddf',dim:'#91a58c',border:'#344c35',amber:'#d8b276'};
export const mono='Consolas, "Courier New", monospace';
export const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const Frame:React.FC<{chapter:string;children:React.ReactNode}>=({chapter,children})=>{
 const f=useCurrentFrame();const {fps,durationInFrames}=useVideoConfig();
 return <AbsoluteFill style={{background:'#090e0b',color:colors.text,fontFamily:mono,overflow:'hidden'}}>
 <AbsoluteFill style={{background:'radial-gradient(ellipse at 70% 40%, #29412560, transparent 65%)'}}/>
 <AbsoluteFill style={{backgroundImage:'linear-gradient(#b1ed9507 1px, transparent 1px),linear-gradient(90deg,#b1ed9507 1px,transparent 1px)',backgroundSize:'64px 64px'}}/>
 <div style={{position:'absolute',left:64,right:64,top:32,display:'flex',justifyContent:'space-between',color:colors.dim,fontSize:14,letterSpacing:2}}><span style={{color:colors.green}}>▸ GHOSTSHELL</span><span>{chapter}</span></div>
 <AbsoluteFill style={{opacity:interpolate(f,[0,.5*fps,durationInFrames-.4*fps,durationInFrames-1],[0,1,1,0],clamp),translate:interpolate(f,[0,.7*fps],['0px 14px','0px 0px'],clamp)}}>{children}</AbsoluteFill>
 <div style={{position:'absolute',bottom:28,left:64,right:64,display:'flex',justifyContent:'space-between',fontSize:12,letterSpacing:1.4,color:colors.dim}}><span>GHOST IN THE MACHINE / HACKTOBERFEST 2026</span><span>LOCAL-FIRST TERMINAL MYSTERY</span></div>
 <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'repeating-linear-gradient(0deg,transparent,transparent 3px,#00000018 3px,#00000018 4px)'}}/>
 </AbsoluteFill>;
};
export const Kicker:React.FC<{children:React.ReactNode}>=({children})=><div style={{color:colors.green,fontSize:16,letterSpacing:3,marginBottom:22}}>{children}</div>;
export const Terminal:React.FC<{command:string;output:string;start?:number}>=({command,output,start=0})=>{
 const f=useCurrentFrame();const {fps}=useVideoConfig();const t=Math.max(0,f-start*fps);const n=Math.floor(t/(fps*.035));
 return <div style={{border:`1px solid ${colors.border}`,background:'#0c140e',boxShadow:'0 25px 90px #0007'}}><div style={{padding:'14px 22px',borderBottom:`1px solid ${colors.border}`,display:'flex',justifyContent:'space-between',fontSize:13,color:colors.dim}}><span>○ ○ ○  echo@workstation-07</span><span style={{color:colors.amber}}>SCRIPTED WALKTHROUGH</span></div><div style={{padding:28,minHeight:270}}><div style={{fontSize:23,color:colors.green,marginBottom:26}}><span style={{color:colors.dim}}>$ </span>{command.slice(0,n)}<span style={{opacity:Math.floor(f/(fps*.5))%2?0:1}}>▌</span></div><pre style={{whiteSpace:'pre-wrap',fontFamily:mono,fontSize:22,lineHeight:1.6,margin:0,color:'#cad9c4',opacity:interpolate(t,[command.length*fps*.035,command.length*fps*.035+.3*fps],[0,1],clamp)}}>{output}</pre></div></div>;
};
