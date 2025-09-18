"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import AddNewSessionDialog from './AddNewSessionDialog'
import axios from 'axios'
import HistoryTable from './HistoryTable'
import { SessionDetail } from '../medical-agent/[sessionId]/page'

function HistoryList() {
    const [historyList, setHistoryList] = React.useState<SessionDetail[]>([])
   
    React.useEffect(() => {
        GetHistoryList();
    }, []);

    const GetHistoryList=async () => {
        try {
            const result = await axios.get("/api/session-chat?sessionId=all");
            if (!result.data) {
                throw new Error("No history data found");
            }
            console.log(result.data);
            
            setHistoryList(result.data);
        } catch (error) {
            
        }
    }
    
   
    return (
    <div>
        {
            historyList.length == 0 ? (
                <div className='flex items-center flex-col border-2 mt-7 justify-center p-7 border-dashed rounded-2xl'>
                    <Image src={"/medical-assistance.png"} alt='empty' width={150} height={150}/>
                    <h2 className='font-bold text-xl mt-5'>No Recent Consultation</h2>
                    <p className='mt-3'>It looks you haven't consulted any doctor yet.</p>
                    <AddNewSessionDialog/>
                </div>

            ) :(
                <div>
                    <HistoryTable historyList={historyList}/>
                </div>
            )
        }
    </div>
  )
}

export default HistoryList