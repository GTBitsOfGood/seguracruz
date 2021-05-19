import React from 'react'
import { Icon } from 'semantic-ui-react';
import Lottie from 'react-lottie';
import phone from '../../res/phone.png';
import messageBubble from '../../res/message-bubble.json';
import './Home.scss';

export default function Home() {
  const messageBubbleOptions = {
    loop: true,
    autoplay: true, 
    animationData: messageBubble
  };

  return (
    <div className='home'>
      <div className='home-nav'>
      <h2 className="header-title"><a href='/'>SeguraCruz</a></h2>
        <a href='#/dash'>
          <button className='dash-button'>Dashboard <Icon name='sign-in'/></button>
        </a>
      </div>
      <div className="header-content">
        <img src={phone} className="phone" alt="HikerNet screenshot"/>
        <div className='header-message'>
          <div className='header-message-example'>
            <div className='animation'>
              <Lottie options={messageBubbleOptions}/>
            </div>
            <p className='text-example'>"Hello, SeguraCruz..."</p>
          </div>
          <div className='phone-info'>
            <p className='phone-number'>+591 60210510</p>
            <p className='phone-number-text'>Text this number on WhatsApp to help report roadway accidents and injuries in the city of Santa Cruz!</p>
          </div>
          <a href={require('../../res/chatbot-training.pdf')} download>
            <button className='dash-button download'>Download Training <Icon name='download'/></button>
          </a>
        </div>
        
      </div>
    </div>     
  )
}