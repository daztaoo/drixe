'use client'

import { useRef, useState, useEffect } from 'react'
import {
  motion, useScroll, useTransform, useSpring, useInView, AnimatePresence
} from 'framer-motion'

/* ──────────────────────────────────────────────
   PHOTOS — swap these 3 paths with yours
────────────────────────────────────────────── */
const PHOTOS = [
  { src: '/images/photo1.jpg',    label: 'My fav memory 💕',  tilt: -5,              badge: false },
  { src: '/images/photo2.jpg',    label: 'You & me, always',  tilt:  3,              badge: false },
  { src: '/images/wallpaper.jpg', label: 'My wallpaper 💖',   tilt: -2,              badge: true  },
]

/* ──────────────────────────────────────────────
   ALL STYLES (injected once, no Tailwind needed beyond what's global)
────────────────────────────────────────────── */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');

.mk { font-family:'Crimson Pro',serif; background:#09000A; color:#f4e8ec; overflow-x:hidden; cursor:none; -webkit-tap-highlight-color:transparent; }
.mk *, .mk *::before, .mk *::after { box-sizing:border-box; }

/* Gradient text */
.gt {
  background:linear-gradient(135deg,#f4a7c0 0%,#d4a862 50%,#f4a7c0 100%);
  background-size:200% auto; -webkit-background-clip:text;
  -webkit-text-fill-color:transparent; background-clip:text;
  animation:shimmer 4s linear infinite;
}
@keyframes shimmer { to { background-position:200% center; } }

/* Glass */
.glass { background:rgba(201,80,122,.05); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border:1px solid rgba(201,80,122,.17); }

/* Ornament */
.orn { display:flex; align-items:center; gap:10px; color:#c9507a; }
.orn::before,.orn::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,transparent,rgba(201,80,122,.4),transparent); }

/* Cursor — desktop only */
@media(pointer:fine){
  .c-dot { position:fixed;pointer-events:none;z-index:9999;width:10px;height:10px;border-radius:50%;background:#f4a7c0;mix-blend-mode:difference;transform:translate(-50%,-50%); }
  .c-ring{ position:fixed;pointer-events:none;z-index:9998;width:36px;height:36px;border-radius:50%;border:1px solid rgba(201,80,122,.5);transform:translate(-50%,-50%); }
}
@media(pointer:coarse){ .c-dot,.c-ring{ display:none; } }

/* Floating hearts — pure CSS, GPU composited */
@keyframes fh {
  0%  { transform:translateY(105vh) rotate(0deg)   scale(1);  opacity:0; }
  6%  { opacity:.5; }
  90% { opacity:.25; }
  100%{ transform:translateY(-8vh)  rotate(600deg) scale(.75);opacity:0; }
}
.fh { position:fixed; pointer-events:none; will-change:transform; animation:fh linear infinite; transform:translateZ(0); z-index:1; }

/* Grain */
.grain::after { content:''; position:fixed; inset:0; pointer-events:none; z-index:2; opacity:.25;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.06'/%3E%3C/svg%3E");
}

/* Scroll bar */
.sbar { position:fixed; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#c9507a,#d4a862); transform-origin:left; z-index:50; }

/* Tap ripple */
@keyframes rip { to { transform:scale(4); opacity:0; } }
.rip { position:absolute; border-radius:50%; background:rgba(244,167,192,.25); animation:rip .65s ease-out forwards; pointer-events:none; transform:translateZ(0); }

/* Mobile photo scroll hint */
@media(max-width:767px){
  .photo-row { overflow-x:auto; -webkit-overflow-scrolling:touch; scroll-snap-type:x mandatory; scrollbar-width:none; }
  .photo-row::-webkit-scrollbar { display:none; }
  .photo-snap { scroll-snap-align:center; }
}
`

/* ──────────────────────────────────────────────
   CURSOR
────────────────────────────────────────────── */
function Cursor() {
  const dot  = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let rx=0,ry=0,mx=0,my=0,raf=0
    const mv=(e:MouseEvent)=>{
      mx=e.clientX;my=e.clientY
      if(dot.current){dot.current.style.left=mx+'px';dot.current.style.top=my+'px'}
    }
    const loop=()=>{
      rx+=(mx-rx)*.11;ry+=(my-ry)*.11
      if(ring.current){ring.current.style.left=rx+'px';ring.current.style.top=ry+'px'}
      raf=requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove',mv); loop()
    return()=>{window.removeEventListener('mousemove',mv);cancelAnimationFrame(raf)}
  },[])
  return <><div ref={dot} className="c-dot"/><div ref={ring} className="c-ring"/></>
}

/* ──────────────────────────────────────────────
   FLOATING HEARTS (CSS only)
────────────────────────────────────────────── */
const HRT = [
  {l:'7%', d:'13s',dl:'0s',  s:'13px'},
  {l:'17%',d:'17s',dl:'3.5s',s:'16px'},
  {l:'26%',d:'11s',dl:'7s',  s:'10px'},
  {l:'36%',d:'19s',dl:'1s',  s:'14px'},
  {l:'44%',d:'14s',dl:'5.5s',s:'18px'},
  {l:'53%',d:'16s',dl:'2s',  s:'11px'},
  {l:'62%',d:'10s',dl:'9.5s',s:'15px'},
  {l:'71%',d:'18s',dl:'4s',  s:'13px'},
  {l:'80%',d:'15s',dl:'6.5s',s:'17px'},
  {l:'89%',d:'12s',dl:'8s',  s:'12px'},
  {l:'4%', d:'20s',dl:'12s', s:'9px' },
  {l:'93%',d:'11s',dl:'14s', s:'14px'},
  {l:'49%',d:'17s',dl:'0.8s',s:'10px'},
  {l:'21%',d:'22s',dl:'15s', s:'16px'},
  {l:'76%',d:'14s',dl:'10s', s:'11px'},
]
const HE=['🌸','💕','💗','🌹','💖','🌷','✨']
function Hearts(){ return <>{HRT.map((h,i)=><span key={i} className="fh" style={{left:h.l,fontSize:h.s,animationDuration:h.d,animationDelay:h.dl,opacity:0}}>{HE[i%HE.length]}</span>)}</> }

/* ──────────────────────────────────────────────
   SCROLL BAR
────────────────────────────────────────────── */
function ScrollBar(){
  const {scrollYProgress}=useScroll()
  const scaleX=useSpring(scrollYProgress,{stiffness:100,damping:30,restDelta:.001})
  return <motion.div className="sbar" style={{scaleX}}/>
}

/* ──────────────────────────────────────────────
   HERO — 4-layer parallax scroll
────────────────────────────────────────────── */
function Hero(){
  const ref=useRef<HTMLElement>(null)
  const {scrollYProgress:sp}=useScroll({target:ref,offset:['start start','end start']})

  const mk=(from:string,to:string,stiff=60)=>
    useSpring(useTransform(sp,[0,1],[from,to]),{stiffness:stiff,damping:22})

  const bY  = mk('0%','28%',50)
  const b2Y = mk('0%','18%',45)
  const tY  = mk('0%','42%',58)
  const sY  = mk('0%','30%',55)
  const gY  = mk('0%','22%',52)
  const fadeO=useSpring(useTransform(sp,[0,.55],[1,0]),{stiffness:80,damping:24})

  return (
    <section ref={ref} style={{position:'relative',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',zIndex:10}}>
      {/* Parallax background blobs */}
      <motion.div style={{position:'absolute',width:520,height:520,borderRadius:'50%',background:'radial-gradient(circle,rgba(201,80,122,.2) 0%,transparent 70%)',top:'8%',left:'50%',x:'-50%',y:bY,filter:'blur(70px)',pointerEvents:'none',willChange:'transform'}}/>
      <motion.div style={{position:'absolute',width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle,rgba(212,168,98,.13) 0%,transparent 70%)',top:'55%',left:'15%',y:b2Y,filter:'blur(60px)',pointerEvents:'none',willChange:'transform'}}/>
      <motion.div style={{position:'absolute',width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(201,80,122,.1) 0%,transparent 70%)',top:'30%',right:'10%',y:mk('0%','35%',42),filter:'blur(50px)',pointerEvents:'none',willChange:'transform'}}/>

      <motion.div style={{opacity:fadeO,position:'relative',zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',padding:'0 24px',gap:20}}>
        {/* Label */}
        <motion.p
          style={{y:gY,color:'#c9507a',fontSize:'.68rem',letterSpacing:'.38em',textTransform:'uppercase'}}
          initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
          transition={{duration:1,delay:.3,ease:[.22,1,.36,1]}}
        >from the bottom of my heart</motion.p>

        {/* Main title — moves fastest on scroll */}
        <motion.h1
          className="gt"
          style={{y:tY,fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:400,fontSize:'clamp(4.5rem,14vw,11rem)',lineHeight:1,letterSpacing:'-.02em'}}
          initial={{opacity:0,y:55,filter:'blur(14px)'}}
          animate={{opacity:1,y:0,filter:'blur(0px)'}}
          transition={{duration:1.3,delay:.5,ease:[.22,1,.36,1]}}
        >I&apos;m Sorry</motion.h1>

        {/* Subtitle — medium parallax */}
        <motion.p
          style={{y:sY,fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'clamp(1.6rem,5vw,2.8rem)',color:'#f4a7c0'}}
          initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
          transition={{duration:1.1,delay:.75,ease:[.22,1,.36,1]}}
        >Babiee 💕</motion.p>

        {/* Ornament */}
        <motion.div className="orn" style={{width:240,margin:'4px 0'}}
          initial={{scaleX:0,opacity:0}} animate={{scaleX:1,opacity:1}}
          transition={{duration:1.2,delay:1,ease:[.22,1,.36,1]}}>
          <span>♥</span>
        </motion.div>

        {/* Tagline — slowest parallax */}
        <motion.p
          style={{y:mk('0%','18%',50),maxWidth:460,fontSize:'clamp(1rem,2.6vw,1.28rem)',color:'rgba(244,232,236,.6)',lineHeight:1.85,fontWeight:300}}
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{duration:1,delay:1.1,ease:[.22,1,.36,1]}}
        >
          Kuch baatein kehne se zyada mehsoos ki jaati hain —<br/>
          yeh bhi unhi mein se ek hai.
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          style={{marginTop:28,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}
          initial={{opacity:0}} animate={{opacity:.4}} transition={{delay:1.6,duration:1}}
        >
          <p style={{fontSize:'.68rem',letterSpacing:'.25em',textTransform:'uppercase'}}>scroll</p>
          <motion.div style={{width:1,height:40,background:'linear-gradient(to bottom,#c9507a,transparent)'}}
            animate={{scaleY:[0,1,0]}} transition={{repeat:Infinity,duration:2,ease:'easeInOut'}}/>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   MESSAGE SECTION — tap anywhere for ripple
────────────────────────────────────────────── */
type Ripple={id:number;x:number;y:number;s:number}
function Message(){
  const ref=useRef<HTMLDivElement>(null)
  const iv=useInView(ref,{once:true,margin:'-80px'})
  const [ripples,setRipples]=useState<Ripple[]>([])

  const splash=(e:React.MouseEvent|React.TouchEvent)=>{
    const el=(e.currentTarget as HTMLElement).getBoundingClientRect()
    const cx='touches' in e?e.touches[0].clientX:(e as React.MouseEvent).clientX
    const cy='touches' in e?e.touches[0].clientY:(e as React.MouseEvent).clientY
    const s=Math.max(el.width,el.height)*1.3
    const id=Date.now()
    setRipples(r=>[...r,{id,x:cx-el.left-s/2,y:cy-el.top-s/2,s}])
    setTimeout(()=>setRipples(r=>r.filter(x=>x.id!==id)),700)
  }

  // section scroll parallax
  const secRef=useRef<HTMLElement>(null)
  const {scrollYProgress:sp}=useScroll({target:secRef,offset:['start end','end start']})
  const secY=useSpring(useTransform(sp,[0,1],['5%','-5%']),{stiffness:55,damping:20})

  const LINES=[
    {t:'head',  v:'Sorry babiee…'},
    {t:'para',  v:'aaj maine tumhe jo bola uske liye —\nMujhe pata hai maine ye cheez pehle bhi boli hai\naur tumhe tab bhi achi nahi lagi thi.'},
    {t:'ital',  v:'Mujhe bas thoda ajeeb lagta hai jab tum aise snaps sabko bhejte ho,\nisliye gusse aur jaldi me bol diya.'},
    {t:'sorry', v:"I'm really sorry babieee…\nI didn't mean to hurt you."},
    {t:'love',  v:'I love you so much… 💕'},
  ]

  return (
    <section ref={secRef} style={{position:'relative',zIndex:10,padding:'7rem 20px'}}>
      <motion.div style={{maxWidth:680,margin:'0 auto',y:secY}}>
        <motion.div
          ref={ref}
          className="glass"
          style={{borderRadius:28,position:'relative',overflow:'hidden',padding:'clamp(2rem,6vw,3.8rem)',cursor:'none',userSelect:'none'}}
          initial={{opacity:0,y:50}}
          animate={iv?{opacity:1,y:0}:{}}
          transition={{duration:1.2,ease:[.22,1,.36,1]}}
          onMouseDown={splash}
          onTouchStart={splash}
          whileTap={{scale:.99}}
        >
          {/* Corner glows */}
          <div style={{position:'absolute',width:200,height:200,borderRadius:'50%',background:'rgba(201,80,122,.18)',top:-60,left:-60,filter:'blur(55px)',pointerEvents:'none'}}/>
          <div style={{position:'absolute',width:240,height:240,borderRadius:'50%',background:'rgba(212,168,98,.1)',bottom:-80,right:-60,filter:'blur(55px)',pointerEvents:'none'}}/>

          {/* Tap ripples */}
          {ripples.map(r=>(
            <span key={r.id} className="rip" style={{left:r.x,top:r.y,width:r.s,height:r.s}}/>
          ))}

          <div style={{position:'relative',zIndex:10,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:28}}>
            {LINES.map((l,i)=>(
              <motion.div key={i}
                initial={{opacity:0,y:22,filter:'blur(6px)'}}
                animate={iv?{opacity:1,y:0,filter:'blur(0px)'}:{}}
                transition={{duration:1,delay:i*.2+.15,ease:[.22,1,.36,1]}}
                style={{width:'100%'}}
              >
                {l.t==='head'&&<h2 className="gt" style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:400,fontSize:'clamp(2.2rem,7vw,4.5rem)',lineHeight:1.2}}>{l.v}</h2>}
                {l.t==='para'&&<p style={{fontSize:'clamp(1.05rem,2.6vw,1.38rem)',color:'rgba(244,232,236,.82)',lineHeight:1.95,fontWeight:300,whiteSpace:'pre-line'}}>{l.v}</p>}
                {l.t==='ital'&&<p style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'clamp(1rem,2.3vw,1.22rem)',color:'rgba(212,168,98,.78)',lineHeight:1.85,whiteSpace:'pre-line'}}>{l.v}</p>}
                {l.t==='sorry'&&(
                  <div>
                    <p style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'clamp(1.7rem,5vw,3rem)',color:'#f4a7c0',lineHeight:1.3,marginBottom:8}}>{l.v.split('\n')[0]}</p>
                    <p style={{fontSize:'clamp(1rem,2.4vw,1.28rem)',color:'rgba(244,232,236,.68)',letterSpacing:'.02em'}}>{l.v.split('\n')[1]}</p>
                  </div>
                )}
                {l.t==='love'&&(
                  <div>
                    <p className="gt" style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:700,fontSize:'clamp(2rem,6.5vw,4rem)',lineHeight:1.15}}>{l.v}</p>
                    <motion.div animate={{scale:[1,1.22,1]}} transition={{repeat:Infinity,duration:1.7,ease:'easeInOut'}} style={{marginTop:12,fontSize:40,display:'inline-block'}}>💕</motion.div>
                  </div>
                )}
                {(i===0||i===2)&&(
                  <motion.div className="orn" style={{maxWidth:200,margin:'8px auto 0',color:'#c9507a'}}
                    initial={{scaleX:0}} animate={iv?{scaleX:1}:{}} transition={{duration:1,delay:i*.2+.4}}>
                    <span style={{fontSize:11}}>✦</span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.p initial={{opacity:0}} animate={iv?{opacity:1}:{}} transition={{delay:1.5,duration:1}}
          style={{textAlign:'center',marginTop:14,fontSize:'.68rem',letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(201,80,122,.4)'}}>
          tap the card 💕
        </motion.p>
      </motion.div>
    </section>
  )
}

/* ──────────────────────────────────────────────
   3D PHOTO CARD — mouse + touch tilt
────────────────────────────────────────────── */
function Card({src,label,tilt,badge,index,iv}:{src:string;label:string;tilt:number;badge:boolean;index:number;iv:boolean}){
  const [rot,setRot]=useState({x:0,y:0})
  const [on,setOn]=useState(false)
  const el=useRef<HTMLDivElement>(null)

  const calc=(cx:number,cy:number)=>{
    const r=el.current!.getBoundingClientRect()
    setRot({x:((cy-r.top)/r.height-.5)*-20,y:((cx-r.left)/r.width-.5)*20})
  }
  const reset=()=>{setRot({x:0,y:0});setOn(false)}

  const W=badge?265:232, H=badge?365:308

  return(
    <motion.div
      initial={{opacity:0,y:65,rotate:tilt*2.5}}
      animate={iv?{opacity:1,y:0,rotate:tilt}:{}}
      transition={{duration:1.25,delay:index*.22+.2,ease:[.22,1,.36,1]}}
      style={{perspective:900}}
      className="photo-snap"
    >
      <motion.div
        ref={el}
        onMouseMove={e=>{calc(e.clientX,e.clientY);setOn(true)}}
        onMouseLeave={reset}
        onTouchMove={e=>{e.preventDefault();calc(e.touches[0].clientX,e.touches[0].clientY);setOn(true)}}
        onTouchEnd={reset}
        animate={{rotateX:rot.x,rotateY:rot.y,scale:on?1.05:1}}
        transition={{type:'spring',stiffness:260,damping:22}}
        whileTap={{scale:1.07}}
        style={{position:'relative',transformStyle:'preserve-3d',width:W,height:H,cursor:'none'}}
      >
        {/* Glow */}
        <motion.div animate={{opacity:on?.65:.18,scale:on?1.07:1}} transition={{duration:.35}}
          style={{position:'absolute',inset:-16,borderRadius:28,zIndex:-1,filter:'blur(22px)',
            background:badge?'linear-gradient(135deg,#c9507a,#d4a862)':'linear-gradient(135deg,#c9507a,#9b2b55)'}}/>

        {/* Frame */}
        <div style={{width:'100%',height:'100%',borderRadius:20,overflow:'hidden',position:'relative',
          border:'1px solid rgba(201,80,122,.28)',
          boxShadow:on?'0 28px 60px rgba(0,0,0,.55),0 0 38px rgba(201,80,122,.2)':'0 12px 38px rgba(0,0,0,.45)',
          transition:'box-shadow .35s ease'}}>

          {/* Image */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(201,80,122,.15),rgba(212,168,98,.08))'}}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={label} style={{width:'100%',height:'100%',objectFit:'cover'}}
              onError={e=>{(e.target as HTMLElement).style.display='none'}}/>
          </div>

          {/* Bottom gradient */}
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(9,0,10,.78) 0%,transparent 55%)',pointerEvents:'none'}}/>

          {/* Label */}
          <motion.p animate={{y:on?0:5,opacity:on?1:.76}} transition={{duration:.3}}
            style={{position:'absolute',bottom:0,left:0,right:0,padding:16,
              fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'.9rem',
              color:'#f4a7c0',textShadow:'0 2px 8px rgba(0,0,0,.9)'}}>
            {label}
          </motion.p>

          {/* Shine */}
          <motion.div animate={{opacity:on?1:0}} style={{position:'absolute',inset:0,borderRadius:20,pointerEvents:'none',
            background:'linear-gradient(135deg,rgba(255,255,255,.09) 0%,transparent 55%)'}}/>
        </div>

        {/* Spinning badge */}
        {badge&&(
          <motion.div animate={{rotate:360}} transition={{duration:7,repeat:Infinity,ease:'linear'}}
            style={{position:'absolute',top:-12,right:-12,width:36,height:36,borderRadius:'50%',
              display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,zIndex:10,
              background:'linear-gradient(135deg,#c9507a,#d4a862)',boxShadow:'0 4px 14px rgba(201,80,122,.55)'}}>
            💕
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────
   PHOTOS SECTION — horizontal scroll on mobile
────────────────────────────────────────────── */
function Photos(){
  const ref=useRef<HTMLElement>(null)
  const iv=useInView(ref,{once:true,margin:'-80px'})
  const {scrollYProgress:sp}=useScroll({target:ref,offset:['start end','end start']})
  const sY=useSpring(useTransform(sp,[0,1],['5%','-5%']),{stiffness:55,damping:20})

  return(
    <section ref={ref} style={{position:'relative',zIndex:10,padding:'5rem 20px 6rem',overflow:'hidden'}}>
      <motion.div style={{maxWidth:1000,margin:'0 auto',y:sY}}>
        <motion.div style={{textAlign:'center',marginBottom:56}}
          initial={{opacity:0,y:26}} animate={iv?{opacity:1,y:0}:{}} transition={{duration:1,ease:[.22,1,.36,1]}}>
          <p style={{color:'#c9507a',fontSize:'.68rem',letterSpacing:'.38em',textTransform:'uppercase',marginBottom:14}}>because pictures say it all</p>
          <h2 className="gt" style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:400,fontSize:'clamp(2rem,5.5vw,3.8rem)'}}>Us, always.</h2>
        </motion.div>

        {/* Horizontal scrollable on mobile, centered flex on desktop */}
        <div className="photo-row"
          style={{display:'flex',alignItems:'flex-end',justifyContent:'center',gap:24,paddingBottom:16}}>
          {PHOTOS.map((p,i)=><Card key={i} {...p} index={i} iv={iv}/>)}
        </div>

        <motion.p initial={{opacity:0}} animate={iv?{opacity:1}:{}} transition={{delay:1.2,duration:1}}
          style={{textAlign:'center',marginTop:40,fontFamily:"'Playfair Display',serif",fontStyle:'italic',
            fontSize:'clamp(1rem,2.5vw,1.4rem)',color:'rgba(212,168,98,.68)'}}>
          Tu mera wallpaper hai — aur mere dil ka bhi. 💕
        </motion.p>
      </motion.div>
    </section>
  )
}
function HiddenLetter() {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef(null)
  const iv = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section ref={ref} style={{ position: 'relative', zIndex: 10, padding: '4rem 20px', display: 'flex', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={iv ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }}
        style={{ width: '100%', maxWidth: 500 }}
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
          style={{
            width: '100%', padding: '20px', background: 'rgba(201,80,122,.05)', border: '1px solid rgba(201,80,122,.3)',
            borderRadius: 16, color: '#f4a7c0', fontFamily: "'Playfair Display',serif", fontStyle: 'italic',
            fontSize: '1.3rem', cursor: 'pointer', outline: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}
        >
          <span>A secret message for you...</span>
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>▼</motion.span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
              exit={{ opacity: 0, height: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ overflow: 'hidden' }}
            >
              <div className="glass" style={{ marginTop: 16, padding: '30px', borderRadius: 16, color: 'rgba(244,232,236,.8)', lineHeight: 1.8, fontWeight: 300 }}>
                <p>No matter how far apart we are, you are always the closest thing to my heart. you might be miles away, but I carry you with me every single day. I promise to be better. 💕</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
/* ──────────────────────────────────────────────
   FOOTER
────────────────────────────────────────────── */
const FH=['💕','💗','💖','💓','💘','❣️','💞']
function Footer(){
  const ref=useRef<HTMLElement>(null)
  const iv=useInView(ref,{once:true,margin:'-60px'})
  const {scrollYProgress:sp}=useScroll({target:ref,offset:['start end','end start']})
  const fY=useSpring(useTransform(sp,[0,1],['7%','-7%']),{stiffness:50,damping:20})

  return(
    <footer ref={ref} style={{position:'relative',zIndex:10,padding:'6rem 20px 5rem',textAlign:'center',overflow:'hidden'}}>
      <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 50% 60% at 50% 90%,rgba(201,80,122,.12) 0%,transparent 70%)',pointerEvents:'none'}}/>

      <motion.div style={{position:'relative',zIndex:10,y:fY}}>
        <motion.div className="orn" style={{maxWidth:340,margin:'0 auto 4rem',color:'#c9507a'}}
          initial={{scaleX:0,opacity:0}} animate={iv?{scaleX:1,opacity:1}:{}} transition={{duration:1.2}}>
          <span>✦</span>
        </motion.div>

        {/* Tappable hearts */}
        <motion.div style={{display:'flex',justifyContent:'center',gap:12,marginBottom:48,flexWrap:'wrap'}}
          initial={{opacity:0}} animate={iv?{opacity:1}:{}} transition={{delay:.3,duration:1}}>
          {FH.map((h,i)=>(
            <motion.button key={i}
              animate={{y:[0,-13,0]}} transition={{duration:2.1,delay:i*.18,repeat:Infinity,ease:'easeInOut'}}
              whileTap={{scale:1.65,rotate:20}}
              style={{fontSize:28,background:'none',border:'none',outline:'none',cursor:'none',padding:4}}>
              {h}
            </motion.button>
          ))}
        </motion.div>

        <motion.div initial={{opacity:0,y:28}} animate={iv?{opacity:1,y:0}:{}} transition={{delay:.5,duration:1.2,ease:[.22,1,.36,1]}}>
          <h2 className="gt" style={{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontWeight:400,fontSize:'clamp(2.8rem,10vw,7rem)',lineHeight:1.1,marginBottom:20}}>
            I love you<br/>so much.
          </h2>
          <p style={{fontSize:'clamp(1rem,2.5vw,1.3rem)',color:'rgba(244,232,236,.56)',fontStyle:'italic',lineHeight:1.85}}>
            Meri galti thi. Tumhara gussa bilkul sahi tha.<br/>
            But so was my love — aur that never changed.
          </p>
        </motion.div>

        <motion.div animate={{scale:[1,1.18,1]}} transition={{duration:1.5,repeat:Infinity,ease:'easeInOut'}}
          style={{marginTop:48,fontSize:72,display:'inline-block'}}>💕</motion.div>

        <motion.p initial={{opacity:0}} animate={iv?{opacity:1}:{}} transition={{delay:1.5,duration:1}}
          style={{marginTop:56,fontSize:'.68rem',color:'rgba(244,232,236,.15)',letterSpacing:'.22em',textTransform:'uppercase'}}>
          made with love, only for you 💗
        </motion.p>
      </motion.div>
    </footer>
  )
}

/* ──────────────────────────────────────────────
   ROOT EXPORT
────────────────────────────────────────────── */
export default function ManikPage(){
  return(
    <>
      <style dangerouslySetInnerHTML={{__html:STYLES}}/>
      <div className="mk grain" style={{minHeight:'100vh',position:'relative'}}>
        <ScrollBar/>
        <Cursor/>
        <Hearts/>
        {/* Vignette */}
        <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:3,
          background:'radial-gradient(ellipse 100% 100% at 50% 50%,transparent 35%,rgba(9,0,10,.68) 100%)'}}/>
        <Hero/>
        <Message/>
        <Photos/>
        <HiddenLetter/>
        <Footer/>
      </div>
    </>
  )
}