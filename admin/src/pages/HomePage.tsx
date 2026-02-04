import { Main } from "@strapi/design-system";
import { useIntl } from "react-intl";

import Repo from "../components/Repo";
import { getTranslation } from "../utils/getTranslation";

const HomePage = () => {
  const { formatMessage } = useIntl();

  return (
    <Main>
      <Repo />
    </Main>
  );
};

export { HomePage };
