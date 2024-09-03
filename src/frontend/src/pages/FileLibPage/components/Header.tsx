import { Dialog, DialogTrigger } from "@/components/bs-ui/dialog";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../../components/bs-ui/button";
import ShadTooltip from "../../../components/ShadTooltipComponent";
import KnowledgeBaseSettingsDialog from "./EditKnowledgeDialog";
import { useToast } from "@/components/bs-ui/toast/use-toast";
import { captureAndAlertRequestErrorHoc } from "@/controllers/request";
import { updateKnowledgeApi } from "@/controllers/API";

export default function Header() {
    const [libInfo, setLibInfo] = useState({ name: '', desc: '' })
    const [open, setOpen] = useState(false)
    const { id } = useParams()

    useEffect(() => {
        // @ts-ignore
        const [libname, libdesc] = window.libname || [] // 临时记忆
        if (libname) {
            localStorage.setItem('libname', libname)
            localStorage.setItem('libdesc', libdesc)
        }
        setLibInfo({ name: libname || localStorage.getItem('libname'), desc: libdesc || localStorage.getItem('libdesc') })
    }, [])

    const { message } = useToast()
    const handleSave = (form) => {
        captureAndAlertRequestErrorHoc(updateKnowledgeApi({
            id: Number(id),
            name: form.name,
            description: form.desc
        })).then((res) => {
            if (!res) return
            // api
            setLibInfo(form)
            setOpen(false)
            message({ variant: 'success', description: '保存成功' })
        })
    }

    return <div className="flex items-start">
        <ShadTooltip content="back" side="top">
            <button className="extra-side-bar-buttons w-[36px]" onClick={() => { }} >
                <Link to='/filelib'><ArrowLeft className="side-bar-button-size" /></Link>
            </button>
        </ShadTooltip>
        <div>
            <div className="group flex items-center">
                <span className=" text-gray-700 text-sm font-black pl-4">{libInfo.name}</span>
                {/* edit dialog */}
                <Dialog open={open} onOpenChange={setOpen} >
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="group-hover:visible invisible"><Pencil2Icon /></Button>
                    </DialogTrigger>
                    {
                        open && <KnowledgeBaseSettingsDialog initialName={libInfo.name} initialDesc={libInfo.desc} onSave={handleSave}></KnowledgeBaseSettingsDialog>
                    }
                </Dialog>
            </div>
            <p className="pl-4 text-muted-foreground text-sm">{libInfo.desc}</p>
        </div>
    </div>
};
