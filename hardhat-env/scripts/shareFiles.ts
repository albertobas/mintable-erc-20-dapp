import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { artifacts } from 'hardhat';
import { join } from 'path';

async function shareFiles() {
  const hardhatContractsPath = join(__dirname, '../artifacts/contracts');
  const hardhatContractsTypePath = join(__dirname, '../typechain-types');
  const reactContractsPath = join(__dirname, '../../react-app/src/utils/contracts');
  const reactContractsTypesPath = join(__dirname, '../../react-app/src/utils/types');
  const contractsList = readdirSync(hardhatContractsPath).filter((path) => /\.sol$/.test(path));
  contractsList.forEach((slug) => {
    const contractSlug = slug.replace(/\.sol/, '');
    const contractJSON = contractSlug + '.json';
    const contractJSONPath = join(reactContractsPath, contractJSON);
    const contractType = contractSlug + '.ts';
    const contractTypePath = join(reactContractsTypesPath, contractType);
    const artifact = artifacts.readArtifactSync(contractSlug);
    if (!existsSync(reactContractsPath)) {
      mkdirSync(reactContractsPath, { recursive: true });
    }
    writeFileSync(contractJSONPath, JSON.stringify(artifact, null, 2));
    const typeData = readFileSync(join(hardhatContractsTypePath, contractType), 'utf8');
    if (!existsSync(reactContractsTypesPath)) {
      mkdirSync(reactContractsTypesPath, { recursive: true });
    }
    writeFileSync(contractTypePath, typeData);
  });
  const contractTypeCommon = 'common.ts';
  const contractTypeCommonPath = join(reactContractsTypesPath, contractTypeCommon);
  const typeCommonData = readFileSync(join(hardhatContractsTypePath, contractTypeCommon), 'utf8');
  if (!existsSync(reactContractsTypesPath)) {
    mkdirSync(reactContractsTypesPath, { recursive: true });
  }
  writeFileSync(contractTypeCommonPath, typeCommonData);
  return {
    contractsNum: contractsList.length,
    reactContractsPath: reactContractsPath,
    reactContractsTypesPath: reactContractsTypesPath,
  };
}

shareFiles()
  .then(({ contractsNum, reactContractsPath, reactContractsTypesPath }) => {
    console.log(`  ✓ ${contractsNum} contract(s) copied to ${reactContractsPath}`);
    console.log(`  ✓ ${contractsNum} contract(s) type(s) copied to ${reactContractsTypesPath}`);
    console.log(`  ✓ Contract type required module common.ts copied to ${reactContractsTypesPath}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
