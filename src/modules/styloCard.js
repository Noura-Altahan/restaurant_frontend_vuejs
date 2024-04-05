import { headers } from "@/shares/share";
import axios from "axios";
import toast from "@/components/ToastBlock.vue";
const getStyloCardTypes = async (state, BlockContent) => {
    BlockContent.value.statusLoading();
    try {
        const response = await axios.post(
            "/master_card/get_card_type",
            {},
            {
                headers: headers(),
            }
        );
        if (
            !response.data.data.code &&
            response.data.data.stylo_status === 200
        ) {
            state.data = response.data.data;
        } else {
            toast.fire("Oops...", response.data.data.description, "error");
        }
    } catch (error) {
        toast.fire("Oops...", "Something went wrong!", "error");
    } finally {
        BlockContent.value.statusNormal();
    }
};

export default getStyloCardTypes;
