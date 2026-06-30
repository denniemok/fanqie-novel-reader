function HostCodeList({ hostnames, separator = ' 或 ' }) {
  return hostnames.map((host, index) => (
    <span key={host}>
      {index > 0 ? separator : ''}
      <code>{host}</code>
    </span>
  ));
}

export default HostCodeList;
