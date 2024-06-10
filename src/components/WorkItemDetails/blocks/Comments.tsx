import { Fragment } from "react";
import { get, map, size } from "lodash";
import { Title, HorizontalDivider } from "@deskpro/app-sdk";
import { NoFound, Comment } from "../../common";
import type { FC } from "react";
import type { IAzureComment } from "../../../types/azure";

type Props = {
  comments: IAzureComment["comments"];
  onNavigateToAddComment: () => void;
};

const Comments: FC<Props> = ({ comments, onNavigateToAddComment }) => {
  return (
    <>
      <Title
        title={`Comments (${size(comments)})`}
        onClick={onNavigateToAddComment}
      />

      {!size(comments)
        ? <NoFound text="No comments found"/>
        : map(comments, (c) => (
          <Fragment key={c.id}>
            <Comment
              name={get(c, ["createdBy", "displayName"]) || get(c, ["createdBy", "uniqueName"])}
              text={get(c, ["text"])}
              date={new Date(get(c, ["createdDate"]))}
              avatarUrl={get(c, ["createdBy", "imageUrl"])}
            />
            <HorizontalDivider style={{ marginBottom: 10 }}/>
          </Fragment>
        ))
      }
    </>
  );
};

export { Comments };
