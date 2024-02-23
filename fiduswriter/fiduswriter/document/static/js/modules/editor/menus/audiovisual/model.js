import {V} from "../../dialogs"
import {figureMenuAction} from "./utils"
import { VideoDialog } from "../../dialogs"

export const AudiovisualMenuModel = () => ({
    content: [
        {
            title: `${gettext("Editar")}`,
            type: "action",
            tooltip: gettext("Editar la informacion del audiovisual."),
            order: 1,
            action: editor => {
                const dialog = new VideoDialog(editor)
                dialog.init()
                return false
            },
            //disabled: editor => !(editor.currentView.state.selection.node?.type.name === "audiovisual") || editor.currentView.state.selection.node?.attrs.track?.find(track => track.type === "deletion")
        },
    //     {
    //         title: gettext("Delete figure"),
    //         type: "action",
    //         icon: "trash-alt",
    //         tooltip: gettext("Delete the figure"),
    //         order: 2,
    //         action: editor => {
    //             const tr = editor.currentView.state.tr
    //             tr.deleteSelection()
    //             editor.currentView.dispatch(tr)
    //         },
    //         disabled: editor => !(editor.currentView.state.selection.node?.type.name === "figure") || editor.currentView.state.selection.node?.attrs.track?.find(track => track.type === "deletion")
    //     }
    ]
})

// export const figureWidthMenuModel = () => ({
//     content: [
//         {
//             title: "100 %",
//             type: "action",
//             order: 0,
//             value: "100",
//             action: figureDialog => {
//                 figureMenuAction("100", figureDialog)
//             },
//             selected: false
//         },
//         {
//             title: "75 %",
//             type: "action",
//             order: 1,
//             value: "75",
//             action: figureDialog => {
//                 figureMenuAction("75", figureDialog)
//             },
//             selected: false
//         },
//         {
//             title: "50 %",
//             type: "action",
//             order: 2,
//             value: "50",
//             action: figureDialog => {
//                 figureMenuAction("50", figureDialog)
//             },
//             selected: false
//         },
//         {
//             title: "25 %",
//             type: "action",
//             order: 3,
//             value: "25",
//             action: figureDialog => {
//                 figureMenuAction("25", figureDialog)
//             },
//             selected: false
//         }
//     ]
// })