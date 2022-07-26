import { TRPCClient } from "@trpc/client/dist/declarations/src/internals/TRPCClient"

export class IngListR extends Component {

    ingData = trpc.useQuery(["ingredient.getSortedIng"]);

    

    function fillIngList(ingData) => {
        
    };
    render() {
        return 
    }
};