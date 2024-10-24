import { useSortable } from "@dnd-kit/sortable";
import { Tag } from "antd";
import PropTypes from "prop-types";

interface Item {
  id: string;
  text: string;
}

interface DraggableTagProps {
  tag: Item;
}

const commonStyle: React.CSSProperties = {
  cursor: "move",
  transition: "unset",
  fontSize: "14px",
};

const DraggableTag: React.FC<DraggableTagProps> = (props) => {
  const { tag } = props;
  const { listeners, transform, transition, isDragging, setNodeRef } =
    useSortable({ id: tag.id });

  const style = transform
    ? {
        ...commonStyle,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: isDragging ? "unset" : transition,
      }
    : commonStyle;

  return (
    <Tag style={style} ref={setNodeRef} {...listeners}>
      {tag.text}
    </Tag>
  );
};

DraggableTag.propTypes = {
  tag: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export default DraggableTag;
