import React from 'react';


function Home() {
    return (
            <>
            <h1 className='welcome-message'>Welcome to KV Publishers</h1>
            <div className='w-full flex items-center justify-evenly gap-4'>
                <div className='w-[500px] h-[360px] '>  
                <img src='https://firebasestorage.googleapis.com/v0/b/kvpublication-daat.appspot.com/o/images%2Fbook-147292_1280.png?alt=media&token=16ce76f5-8141-4896-93ef-515433f4e911' alt='KV Publishers' className='w-full h-full'/>
                </div>
                <div className='w-[500px] h-[360px] text-2xl font-semibold text-center'>
                
                
                <p>No:57, MGR SALAI</p>
                <p>ARCOT - 632503</p>
                <p>RANIPET, TAMILNADU.</p>
                <p>PH: 04172-233850/234850</p>
                <p>CELL: 9445222850/9443490174</p>
                <p>E-mail: kvpublishers@yahoo.com</p>
                </div>
            </div>
            </>
            
           
        
    );
}

export default Home;

