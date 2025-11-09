import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Vocabulary database - sample data (expandable to 500 per category)
const VOCAB_DB = {
  adjectives_beginner: [
    {fr:'grand',en:'big'},{fr:'petit',en:'small'},{fr:'bon',en:'good'},{fr:'mauvais',en:'bad'},{fr:'beau',en:'beautiful'},
    {fr:'vieux',en:'old'},{fr:'jeune',en:'young'},{fr:'nouveau',en:'new'},{fr:'rouge',en:'red'},{fr:'bleu',en:'blue'},
    {fr:'vert',en:'green'},{fr:'noir',en:'black'},{fr:'blanc',en:'white'},{fr:'gris',en:'gray'},{fr:'jaune',en:'yellow'},
    {fr:'chaud',en:'hot'},{fr:'froid',en:'cold'},{fr:'long',en:'long'},{fr:'court',en:'short'},{fr:'haut',en:'high'}
  ],
  verbs_beginner: [
    {fr:'être',en:'to be'},{fr:'avoir',en:'to have'},{fr:'faire',en:'to do/make'},{fr:'aller',en:'to go'},{fr:'voir',en:'to see'},
    {fr:'venir',en:'to come'},{fr:'pouvoir',en:'to be able'},{fr:'vouloir',en:'to want'},{fr:'savoir',en:'to know'},{fr:'devoir',en:'must'},
    {fr:'prendre',en:'to take'},{fr:'donner',en:'to give'},{fr:'parler',en:'to speak'},{fr:'manger',en:'to eat'},{fr:'boire',en:'to drink'},
    {fr:'dormir',en:'to sleep'},{fr:'ouvrir',en:'to open'},{fr:'fermer',en:'to close'},{fr:'lire',en:'to read'},{fr:'écrire',en:'to write'}
  ],
  nouns_beginner: [
    {fr:'maison',en:'house'},{fr:'voiture',en:'car'},{fr:'livre',en:'book'},{fr:'table',en:'table'},{fr:'chaise',en:'chair'},
    {fr:'porte',en:'door'},{fr:'fenêtre',en:'window'},{fr:'pain',en:'bread'},{fr:'eau',en:'water'},{fr:'café',en:'coffee'},
    {fr:'thé',en:'tea'},{fr:'lait',en:'milk'},{fr:'fromage',en:'cheese'},{fr:'pomme',en:'apple'},{fr:'orange',en:'orange'},
    {fr:'chat',en:'cat'},{fr:'chien',en:'dog'},{fr:'oiseau',en:'bird'},{fr:'poisson',en:'fish'},{fr:'arbre',en:'tree'}
  ]
};

const shuffle = (arr) => {
  const a = [...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
};

function App() {
  const [theme,setTheme]=useState('redBlack');
  const [mode,setMode]=useState('select');
  const [topic,setTopic]=useState(null);
  const [difficulty,setDifficulty]=useState('beginner');
  const [words,setWords]=useState([]);
  const [idx,setIdx]=useState(0);
  const [showAnswer,setShowAnswer]=useState(false);
  const [helpWords,setHelpWords]=useState([]);

  const themes={
    redBlack:{bg:'#0a0101',card:'#1a0303',text:'#fff',accent:'#ff1744',btn:'#d50000'},
    dark:{bg:'#121212',card:'#1e1e1e',text:'#e0e0e0',accent:'#bb86fc',btn:'#6200ea'},
    light:{bg:'#f5f5f5',card:'#fff',text:'#212121',accent:'#1976d2',btn:'#0d47a1'}
  };

  const startSession=(t,d)=>{
    const key=`${t}_${d}`;
    const data=VOCAB_DB[key]||VOCAB_DB.adjectives_beginner;
    const selected=shuffle(data).slice(0,20);
    setWords(selected);
    setTopic(t);
    setDifficulty(d);
    setIdx(0);
    setShowAnswer(false);
    setMode('flashcards');
  };

  const nextCard=()=>{
    setShowAnswer(false);
    setIdx(idx+1);
  };

  const needHelp=()=>{
    setHelpWords([...helpWords,words[idx]]);
    nextCard();
  };

  const t=themes[theme];

  return (
    <div style={{minHeight:'100vh',background:t.bg,color:t.text,fontFamily:'system-ui'}}>
      <header style={{padding:'1rem 2rem',background:t.card,borderBottom:`2px solid ${t.accent}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h1 style={{margin:0,color:t.accent}}>French Flashcards</h1>
        <div style={{display:'flex',gap:'1rem'}}>
          <button onClick={()=>setMode('select')} style={btnStyle(t)}>Home</button>
          <button onClick={()=>setMode('help')} style={btnStyle(t)}>Help ({helpWords.length})</button>
          <select value={theme} onChange={(e)=>setTheme(e.target.value)} style={selectStyle(t)}>
            <option value="redBlack">Red & Black</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </header>
      <main style={{padding:'2rem',maxWidth:'800px',margin:'0 auto'}}>
        {mode==='select'&&(
          <div>
            <h2>Select Your Study Session</h2>
            <div style={{marginBottom:'2rem'}}>
              <h3>Difficulty:</h3>
              <div style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
                {['beginner','intermediate','advanced'].map(d=>(
                  <button key={d} onClick={()=>setDifficulty(d)} style={{...btnStyle(t),background:difficulty===d?t.accent:t.btn}}>{d}</button>
                ))}
              </div>
            </div>
            <div>
              <h3>Topic:</h3>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'1rem'}}>
                {['adjectives','verbs','nouns','adverbs','phrases','objects','living things','sentences'].map(top=>(
                  <button key={top} onClick={()=>startSession(top,difficulty)} style={{...btnStyle(t),padding:'1.5rem'}}>{top}</button>
                ))}
              </div>
            </div>
          </div>
        )}
        {mode==='flashcards'&&(
          idx<words.length?(
            <div style={{textAlign:'center'}}>
              <div style={{background:t.card,padding:'4rem 2rem',borderRadius:'1rem',marginBottom:'2rem',boxShadow:'0 8px 32px rgba(0,0,0,0.3)'}}>
                <h2 style={{fontSize:'3rem',marginBottom:'2rem',color:t.accent}}>{words[idx].fr}</h2>
                {showAnswer&&<p style={{fontSize:'2rem',color:t.text}}>{words[idx].en}</p>}
              </div>
              <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
                {!showAnswer?(
                  <button onClick={()=>setShowAnswer(true)} style={btnStyle(t)}>Show Answer</button>
                ):(
                  <>
                    <button onClick={nextCard} style={{...btnStyle(t),background:'#4caf50'}}>I Know This</button>
                    <button onClick={needHelp} style={{...btnStyle(t),background:'#ff9800'}}>Need Help</button>
                  </>
                )}
              </div>
              <p style={{marginTop:'2rem'}}>Card {idx+1} of {words.length}</p>
            </div>
          ):(
            <div style={{textAlign:'center'}}>
              <h2>Session Complete!</h2>
              <p>You studied {words.length} words</p>
              <button onClick={()=>setMode('select')} style={btnStyle(t)}>Back to Home</button>
            </div>
          )
        )}
        {mode==='help'&&(
          <div>
            <h2>Words Needing Help</h2>
            {helpWords.length===0?<p>You're all caught up!</p>:(
              <div style={{display:'grid',gap:'1rem'}}>
                {helpWords.map((w,i)=>(
                  <div key={i} style={{background:t.card,padding:'1rem',borderRadius:'0.5rem',display:'flex',justifyContent:'space-between'}}>
                    <span style={{fontWeight:'bold',color:t.accent}}>{w.fr}</span>
                    <span>{w.en}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={()=>setHelpWords([])} style={{...btnStyle(t),marginTop:'2rem'}}>Clear All</button>
          </div>
        )}
      </main>
    </div>
  );
}

const btnStyle=(t)=>({
  padding:'0.75rem 1.5rem',
  background:t.btn,
  color:t.text,
  border:'none',
  borderRadius:'0.5rem',
  cursor:'pointer',
  fontSize:'1rem',
  fontWeight:'bold',
  transition:'all 0.2s'
});

const selectStyle=(t)=>({
  padding:'0.5rem',
  background:t.card,
  color:t.text,
  border:`1px solid ${t.accent}`,
  borderRadius:'0.5rem',
  fontSize:'1rem'
});

const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
